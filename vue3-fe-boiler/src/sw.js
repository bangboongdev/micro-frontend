import { db } from "@/database/db";
import axios from "axios";
/*
 * Names of the two caches used in this version of the service worker.
 * Change to v2, etc. when you update any of the local resources, which will
 * in turn trigger the install event again.
 */
const WORKER_CACHE = "my-worker-cache-v1";
const RUNTIME = "my-runtime";

// A list of local resources we always want to be cached.
const CACHE_URLS = ["./Main.js"];

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(WORKER_CACHE)
      .then((cache) => cache.addAll(CACHE_URLS))
      .then(self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  const currentCaches = [WORKER_CACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        console.log("cacheNames", cacheNames);
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

/*
 * The fetch handler serves responses for same-origin resources from a cache.
 * If no response is found, it populates the runtime cache with the response
 * from the network before returning it to the page.
 */
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.request).then((response) => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});

// self.addEventListener("message", (event) => {
//   ;
//   console.log(event.data);
//   const entities = event.data.entities;
//   const token = event.data.token;
//   entities.forEach(async (element) => {
//     await loopEntities(element, token);
//   });
// });
const loopEntities = async (entity, token) => {
  const url = "synchronized";
  const baseUrl = self.location.origin + `/api/${url}`;
  db.synchronized
    .where("entity")
    .equals(entity)
    .first(async (data) => {
      const body = {
        entity: entity,
        date: data?.date,
      };
     await axios
        .post(baseUrl, body, {
          headers: {
            Authorization: "Bearer " + token, //the token is a variable which holds the token
          },
        })
        .then(async (response) => {
          let result = response.data.data;
          // Cập nhật date của bảng synchronized
          console.log(result);
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
// self.addEventListener("sync", function (event) {
//   console.log("now online");
// });

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "get-data-news") {
    event.waitUntil(() => {
      console.log("call api data");
    });
  }
});


var oldCacheNames = ['v1', 'v2', 'v3', 'v4'];
var cacheName = 'v5';
var sapoRegex = new RegExp("^(http|https):\/\/([^\.]*).(mysapo\.vn|mysapogo\.com)");
var sapoCDNRegex = new RegExp("^(http|https):\/\/sapo\.dktcdn\.net\/sapo-pos-v2");
var sapoHealthRegex = new RegExp("^(http|https):\/\/([^.]*).(mysapo\.vn|mysapogo\.com)\/admin\/health.json");
var posRegex = new RegExp("\/admin\/pos_v2\/");
var posRegexImg = new RegExp("\.jpg$|\.png$");
var posRegexFile = new RegExp("\/admin\/pos_v2|\.js|\.css|\.woff2|\.woff|\.ttf|\.ico|\.svg");
var posRegexFileCDN = new RegExp("^(http|https):\/\/sapo\.dktcdn\.net\/sapo-pos-v2\/.*\.(js|css|json)");

//event install phát sinh khi client cài đặt service worker
this.addEventListener('install', function (event) {
    console.log('service worker is being installed');
    self.skipWaiting();
    event.waitUntil(function () {
        oldCacheNames.forEach(function (oldCacheName) {
            caches.delete(oldCacheName)
                .then(function (result) {
                    if (result)
                        console.log("delete cache successfully: " + oldCacheName);
                })
                .catch(function (error) {
                    console.log(error);
                })
        });
        caches.delete(cacheName).then(function (boolean) {
            // your cache is now deleted
        });
        caches.open(cacheName).then(function (cache) {
        })
    }());
});

this.addEventListener('activate', function (event) {
    this.clients.claim();
    console.log('service worker is active');
});


//event fetch phát sinh khi client request dữ liệu/file nào đó
this.addEventListener('fetch', function (event) {
    let url = event.request.url.toString();
	if (posRegexImg.test(url)) {
		
        if (navigator.onLine) {
            fetchFromNetworkCDN(event);
        }
        else {
            fetchFromCache(event);
        }
    }
    else if ((!sapoRegex.test(url) && !sapoCDNRegex.test(url))){
		 fetchUncacheResource(event);
	}
    else if (sapoHealthRegex.test(url)) {
        fetchUncacheResource(event);
		console.log("healthRegex" +url)
    }   
    else if (posRegexFileCDN.test(url)) {
        if (navigator.onLine) {
            fetchFromNetworkCDN(event);
        }
        else {
            console.log("offline event", event.request.url)
            fetchFromCache(event);
        }
    }
    else {
        if (navigator.onLine) {
            fetchFromNetwork(event);
        }
        else {
            fetchFromCache(event);
        }
    }
});

//event message phát sinh khi client post message vào service worker
this.addEventListener('message', function (event) {
    console.log("event message", event)
    //trường hợp client muốn lấy ra các pos đã từng được truy cập và có lưu trữ trong cache
    if (event.data.title == 'get-accessed-location') {
        const allClients = clients.matchAll({
            type: 'all'
        });
        let client = allClients[0];
        caches.open(cacheName).then(function (cache) {
            let regex = new RegExp('(/admin/pos_v2/)(\\d+)');
            cache.keys().then(function (keys) {
                let message = [];
                keys.forEach(function (request, index, array) {
                    if (regex.test(request.url)) {
                        message.push(request.url);
                    }

                });
                client.postMessage({
                    title: 'get-accessed-location-response',
                    urls: message
                })
            });
        })
    }

});

function fetchFromCache(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response && response.ok) {
                    return response;
                } else
                    return console.log("Không tìm thấy file " + event.request.url);
            })
    )
}

function fetImage(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    if (response && response.ok) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then(function (response1) {
                                if (response1 && response1.ok) {
                                    cache.put(event.request, response1.clone())
                                        .then(function () {
                                        })
                                        .catch(function (e) {
                                            console.log("put image into caches failed: " + event.request.url);
                                            console.log(e);
											fetchFromCache(event)
                                        });
                                }
                                if (response1)
                                    return response1;
                            })
                            .catch(function (err) {
                                console.log("error on fetching image from network: " + event.request.url);
                                console.log(err);
								fetchFromCache(event)
                            })
                    }
                })
            })
            .catch(function (error) {
                console.log("error on fetching image from cache: " + event.request.url);
                console.log(error);
				fetchFromCache(event)
            })
    )
}
function fetchFromNetworkCDN(event) {
    var requestFetch = new Request(event.request.url, {
        method: event.request.method,
        headers: event.request.headers,
        mode: 'cors',
        redirect: 'manual'
    });
    event.respondWith(
        fetch(requestFetch)
            .then(async function (response) {
                console.log("cdn", response)
                if (response) {
                    if (!response.ok) {
                        console.log(response.statusText);
                    }
                    const cache = await caches.open(cacheName);
                    cache.put(requestFetch, response.clone())
                        .then(function () {
                        })
                        .catch(function (e) {
                            console.log("put fetch response into caches failed: " + requestFetch.url);
                            console.log(e);
                        });
                    return response;
                }
                else {
                    console.log("fetch from network failed: " + requestFetch.url + "; then fetch from cache");
                    caches.match(request).then(function (response) {
                        if (response && response.ok)
                            return response;
                    });
                }
            })
            .catch(function (e) {
                console.log("loi cmnr", e.toString())
            })
    )
}
function fetchFromNetwork(event) {
    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                if (response) {
                    return caches.open(cacheName).then(function (cache) {
                        if (
                            sapoRegex.test(event.request.url.toString())
                            && posRegexFile.test(event.request.url.toString())
                            && response.ok
                        ) {
                            cache.put(event.request, response.clone())
                                .then(function () {
                                })
                                .catch(function (e) {
                                    console.log("put fetch response into caches failed: " + event.request.url);
                                    console.log(e);
									fetchFromCache(event)
                                });
                        }
                        //else
                        //    console.log("not store " + event.request.url.toString());
                        return response;

                    });
                }
                else {
                    console.log("fetch from network failed: " + event.request.url + "; then fetch from cache");
                    caches.match(request).then(function (response) {
                        if (response && response.ok)
                            return response;
                    });
                }
            })
            .catch(function (e) {
				fetchFromCache(event)
            })
    )
}

function fetchUncacheResource(event) {
    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                return response;
            })
            .catch(function (e) {

            })
    )
}