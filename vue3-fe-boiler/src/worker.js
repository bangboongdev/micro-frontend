import { db } from "@/database/db";
import axios from "axios";
import constant from "@/constant";
let url = "synchronized";
let baseUrl = self.location.origin + `/api/${url}`;
onmessage = function (e) {
  const entities = e.data.entities;
  const token = e.data.token;
  if (!db.isOpen()) {
    db.open().then(async (db) => {
      if (e.data.type == constant.typeWorker.create_table) {
        await entities.forEach((element) => {
          fetchDataSync(element, token);
        });
        this.setTimeout(() => {
          this.self.postMessage(constant.typeWorker.synchronized);
        }, 0);
      }
    });
  } else {
    if (e.data.type == constant.typeWorker.create_table) {
      entities.forEach((element) => {
        fetchDataSync(element, token);
      });
      this.setTimeout(() => {
        this.self.postMessage(constant.typeWorker.synchronized);
      }, 0);
    }
    if (e.data.type == constant.typeWorker.synchronized) {
      entities.forEach(async (element) => {
        this.setInterval(() => {
          fetchSynchronized(element, token);
        }, 5 * 60 * 1000);
      });
    }
  }
};

const fetchDataSync = async (entity, token) => {
  const body = {
    entity: entity,
    date: null,
  };
  await db.synchronized
    .where("entity")
    .equals(entity)
    .count(function (element) {
      if (element === 0) {
        db.synchronized.add({
          entity: entity,
          date: null,
        });
      }
    });
  await db[entity]?.count(function (element) {
    if (element === 0) {
      axios
        .post(baseUrl, body, {
          headers: {
            Authorization: "Bearer " + token, //the token is a variable which holds the token
          },
        })
        .then((response) => {
          if (response.data.errorCode == 0) {
            let result = response.data.data.items;
            db[entity].bulkAdd(result).catch("BulkError", function (e) {
              e.failures.forEach((failure) => {
                console.log(failure.message);
              });
            });
          }
        });
    }
  });
};
const fetchSynchronized = async (entity, token) => {
  await db.synchronized
    .where("entity")
    .equals(entity)
    .first(async (data) => {
      const body = {
        entity: entity,
        date: data?.date,
      };
      axios
        .post(baseUrl, body, {
          headers: {
            Authorization: "Bearer " + token, //the token is a variable which holds the token
          },
        })
        .then(async (response) => {
          let result = response.data.data;
          // Cập nhật date của bảng synchronized

          await db.synchronized.put({
            id: data?.id,
            entity: entity,
            date: result.sync_date,
          });
          await db[entity]
            .bulkPut(result.items)
            .then(function () {})
            .catch("BulkError", function (e) {});
        })
        .catch((error) => {});
    });
};
