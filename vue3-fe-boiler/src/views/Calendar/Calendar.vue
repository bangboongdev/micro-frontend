<template>
  <a-row class="container">
    <a-col :span="24" class="header">
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="Lịch làm việc"
      >
      </a-page-header>
    </a-col>
    <a-col :span="24" class="content">
      <a-row :gutter="[0, 24]">
        <a-col :span="24" class="content-header">
          <a-row type="flex" justify="space-between">
            <a-col>
              <a-row type="flex" :gutter="[8, 0]" v-if="viewDateType == 1">
                <a-col>
                  <DoubleLeftOutlined @click="prevDate" />
                </a-col>
                <a-col>
                  <span
                    >{{
                      `Tuần ${currentWeek}/${currentYear} từ ${
                        dayList[0]?.date
                      } đến ${dayList.slice(-1)[0]?.date}`
                    }}
                  </span>
                </a-col>
                <a-col>
                  <DoubleRightOutlined @click="nextDate" />
                </a-col>
              </a-row>
              <a-row type="flex" :gutter="[8, 0]" v-if="viewDateType == 2">
                <a-col>
                  <DoubleLeftOutlined @click="prevDate" />
                </a-col>
                <a-col>
                  <span>{{ `Tháng ${currentMonth}/${currentYear}` }} </span>
                </a-col>
                <a-col>
                  <DoubleRightOutlined @click="nextDate" />
                </a-col>
              </a-row>
            </a-col>
            <a-col>
              <a-row type="flex" :gutter="[8, 0]">
                <a-col>
                  <a-radio-group
                    v-model:value="viewDateType"
                    button-style="solid"
                    @change="getDayList"
                  >
                    <a-row :gutter="[8, 0]">
                      <a-col>
                        <a-radio-button :value="1">{{
                          t("common.calendar.week")
                        }}</a-radio-button>
                      </a-col>
                      <a-col>
                        <a-radio-button :value="2">{{
                          t("common.calendar.month")
                        }}</a-radio-button>
                      </a-col>
                    </a-row>
                  </a-radio-group>
                </a-col>
                <a-col>
                  <a-select
                    v-model:value="viewType"
                    style="width: 120px"
                    @change="onChangeType"
                  >
                    <a-select-option :value="1">Dọc</a-select-option>
                    <a-select-option :value="2">Ngang</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row
            :class="`calendar ${
              viewType == 2 && viewDateType == 2
                ? 'horizontal-month-scroll horizontal-month-max-height '
                : ''
            } ${
              viewType == 1 && viewDateType == 2 ? 'vertical-month-scroll' : ''
            }`"
          >
            <a-col
              :span="viewType == 1 ? 1 : 24"
              :class="`title ${
                viewType == 1
                  ? 'vertical-title-sticky'
                  : 'horizontal-title-sticky'
              }`"
            >
              <a-row>
                <a-col
                  :span="viewType == 1 ? 24 : 2"
                  :class="`time ${viewType == 1 ? 'border-left' : ''}`"
                >
                  <strong>Buổi</strong>
                </a-col>
                <a-col
                  :span="viewType == 1 ? 24 : 11"
                  :class="`morning ${
                    viewType == 1
                      ? 'vertical-height border-left'
                      : 'horizontal-height'
                  }`"
                >
                  <strong>Sáng</strong>
                </a-col>
                <a-col
                  :span="viewType == 1 ? 24 : 11"
                  :class="`afternoon ${
                    viewType == 1
                      ? 'vertical-height border-left'
                      : 'horizontal-height'
                  }`"
                >
                  <strong>Chiều</strong>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="viewType == 1 ? 23 : 24" :class="`list-day`">
              <a-row
                :class="`list-day-content ${
                  viewType == 1 ? 'vertical-display' : ''
                }`"
              >
                <a-col
                  v-for="item in dayList"
                  :key="item.key"
                  :class="`days ${
                    viewType == 1 && viewDateType !== 1
                      ? 'vertical-min-width'
                      : ''
                  } `"
                  :span="viewType == 1 ? none : 24"
                  :flex="
                    viewDateType == 1 && viewType == 1 ? '1 1 240px' : none
                  "
                >
                  <a-row>
                    <a-col
                      :span="viewType == 1 ? 24 : 2"
                      :class="`time ${renderWeekend(item.title)} ${
                        viewType == 1 ? 'height-48' : 'height-auto'
                      }`"
                    >
                      <a-row class="time-content">
                        <strong>
                          {{ item.title.toUpperCase() }}
                        </strong>
                        <br />
                        <span>
                          {{
                            viewDateType == 1
                              ? item.date
                              : moment(item.date, "DD/MM/YYYY")
                                  .format("DD")
                                  .indexOf(0) == "0"
                              ? moment(item.date, "DD/MM/YYYY")
                                  .format("DD")
                                  .substring(1)
                              : moment(item.date, "DD/MM/YYYY").format("DD")
                          }}
                        </span>
                      </a-row>
                    </a-col>
                    <template v-for="time in times" :key="time">
                      <a-col
                        :span="viewType == 1 ? 24 : 11"
                        :class="`${time} ${renderCurrentDate(item.date)} ${
                          viewType == 1
                            ? 'vertical-height'
                            : 'horizontal-height'
                        }`"
                        @click="showCreateEventForm(item, `${time}`)"
                      >
                        <a-row :class="`${time}-content`">
                          <template
                            v-for="event in item.listEvent"
                            :key="event.id"
                          >
                            <a-col :span="24" v-if="event.time == `${time}`">
                              <a-popover
                                trigger="click"
                                :overlayStyle="{ width: '320px' }"
                              >
                                <template #title>
                                  <a-row type="flex" justify="space-between">
                                    <a-col>
                                      <span>{{ event.name }}</span>
                                    </a-col>
                                    <a-col>
                                      <a-row type="flex" :gutter="[8, 0]">
                                        <a-col>
                                          <a-tooltip>
                                            <template #title>{{
                                              t("common.calendar.show_detail")
                                            }}</template>
                                            <EyeOutlined
                                              @click="showDetail()"
                                              :style="{ fontSize: '16px' }"
                                            />
                                          </a-tooltip>
                                        </a-col>
                                        <a-col v-if="userId == event.ins_id">
                                          <a-tooltip>
                                            <template #title>{{
                                              t("common.calendar.edit")
                                            }}</template>
                                            <EditOutlined
                                              :style="{
                                                fontSize: '16px',
                                                color: '#1890ff',
                                              }"
                                              @click="editDetail()"
                                            />
                                          </a-tooltip>
                                        </a-col>
                                        <a-col v-if="userId == event.ins_id">
                                          <a-tooltip>
                                            <template #title>{{
                                              t("common.calendar.delete")
                                            }}</template>
                                            <a-popconfirm
                                              :title="`${t(
                                                'common.calendar.confirm_delete'
                                              )}`"
                                              :ok-text="t('common.confirm')"
                                              :cancel-text="t('common.cancel')"
                                              @confirm="deleteEvent(event.id)"
                                            >
                                              <DeleteOutlined
                                                :style="{
                                                  fontSize: '16px',
                                                  color: 'red',
                                                }"
                                              />
                                            </a-popconfirm>
                                          </a-tooltip>
                                        </a-col>
                                      </a-row>
                                    </a-col>
                                  </a-row>
                                </template>
                                <template #content>
                                  <a-col :span="24">
                                    <a-row type="flex" :guter="[8, 0]">
                                      <a-col :span="6">
                                        <span>{{
                                          `${t("common.calendar.content")}`
                                        }}</span>
                                      </a-col>
                                      <a-col :span="1">
                                        <span>:</span>
                                      </a-col>
                                      <a-col :span="17" class="text-overflow">
                                        <span>
                                          {{ event.content }}
                                        </span>
                                      </a-col>
                                    </a-row>
                                  </a-col>
                                  <a-col :span="24">
                                    <a-row type="flex" :guter="[8, 0]">
                                      <a-col :span="6">
                                        <span>{{
                                          `${t("common.calendar.time")}`
                                        }}</span>
                                      </a-col>
                                      <a-col :span="1">
                                        <span>:</span>
                                      </a-col>
                                      <a-col :span="17" class="text-overflow">
                                        <span>
                                          {{
                                            `${getTime(
                                              event.start_time,
                                              "HH:mm"
                                            )} - ${getTime(
                                              event.end_time,
                                              "HH:mm"
                                            )}`
                                          }}
                                        </span>
                                      </a-col>
                                    </a-row>
                                  </a-col>
                                  <a-col :span="24">
                                    <a-row type="flex" :guter="[8, 0]">
                                      <a-col :span="6">
                                        <span>{{
                                          `${t("common.calendar.location")} :`
                                        }}</span>
                                      </a-col>
                                      <a-col :span="1">
                                        <span>:</span>
                                      </a-col>
                                      <a-col :span="17" class="text-overflow">
                                        <span>
                                          {{ event.location }}
                                        </span>
                                      </a-col>
                                    </a-row>
                                  </a-col>
                                </template>
                                <a-col
                                  :span="24"
                                  @click.stop="showEvent(event)"
                                >
                                  <a-row class="event-item" type="flex" align="middle" justify="center">
                                    <a-col :span="viewType == 1 ? 2 : 1">
                                      <a-row type="flex" align="middle" justify="center">
                                        <div class="dot"></div>
                                      </a-row>
                                    </a-col>
                                    <a-col
                                      :span="viewType == 1 ? 22 : 23"
                                      class="text-overflow"
                                    >
                                      <span
                                        >{{
                                          `${getTime(
                                            event.start_time,
                                            "HH:mm"
                                          )} ${event.name}`
                                        }}
                                      </span>
                                    </a-col>
                                  </a-row>
                                </a-col>
                              </a-popover>
                            </a-col>
                          </template>
                        </a-row>
                      </a-col>
                    </template>
                  </a-row>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-col>
    <a-modal
      v-model:visible="isShowCreate"
      :title="t('common.calendar.add_event')"
      centered
      @cancel="closeCreateEventForm"
    >
      <template #footer>
        <a-button class="btn-cancel" @click="closeCreateEventForm">
          {{ $t("common.back") }}
        </a-button>
        <a-button
          @click="saveForm"
          class="btn-submit"
          v-if="form.mode !== 'seen'"
        >
          <template #icon>
            <SaveOutlined />
          </template>
          {{ $t("common.save") }}
        </a-button>
      </template>
      <a-form
        ref="createForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        labelAlign="left"
        layout="horizontal"
      >
        <a-form-item :label="t('common.calendar.title')" name="title">
          <a-input
            v-model:value="form.name"
            :placeholder="t('common.calendar.title')"
            :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-form-item :label="t('common.calendar.content')" name="content">
          <a-textarea
            v-model:value="form.content"
            :placeholder="t('common.calendar.content')"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 8 }"
          :wraperCol="{ span: 8 }"
          :label="t('common.calendar.start_time')"
          name="startTime"
        >
          <a-date-picker
            :show-time="{ format: 'HH:mm', minuteStep: 5 }"
            v-model:value="form.start_time"
            format="DD/MM/YYYY HH:mm"
            :placeholder="t('common.calendar.start_time')"
            :locale="locale"
            style="width: 100%"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-form-item :label="t('common.calendar.end_time')" name="endTime">
          <a-date-picker
            v-model:value="form.end_time"
            format="DD/MM/YYYY HH:mm"
            :show-time="{ format: 'HH:mm', minuteStep: 5 }"
            type="date"
            :placeholder="t('common.calendar.end_time')"
            :locale="locale"
            style="width: 100%"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-form-item :label="t('common.calendar.location')" name="location">
          <a-input
            v-model:value="form.location"
            :placeholder="t('common.calendar.location')"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-form-item :label="t('common.calendar.department')" name="department">
          <!-- <o-select
            v-model:value="form.attendances"
            :mode="'multiple'"
            entity="user"
            :icon="'environment'"
            :isDisplay="'none'"
            :isDisplayAdd="'none'"
            textField="username"
            valueField="id"
            :placeholder="t('common.calendar.attendances')"
          /> -->
          <a-input
            v-model:value="form.department"
            :placeholder="t('common.calendar.department')"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-form-item :label="t('common.calendar.attendee')" name="attendees">
          <o-select
            v-model:value="form.attendees"
            @input="changeSelectAttendee"
            :mode="'multiple'"
            entity="user"
            :icon="'environment'"
            :isDisplay="'none'"
            :isDisplayAdd="'none'"
            textField="username"
            valueField="id"
            :placeholder="t('common.calendar.attendee')"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-form-item :label="t('common.calendar.priority')" name="priority">
          <a-select
            v-model:value="form.priority"
            @change="onChangePriority"
            :placeholder="t('common.calendar.priority')"
             :disabled="form.mode == 'seen' ? true : false"
          >
            <a-select-option :value="1">Cao</a-select-option>
            <a-select-option :value="2">Trung bình</a-select-option>
            <a-select-option :value="3">Thấp</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="t('common.calendar.note')" name="note">
          <a-textarea
            v-model:value="form.note"
            :placeholder="t('common.calendar.note')"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>

        <a-form-item label="Gửi email" name="isEmail">
          <a-switch
            :checked="form.is_send_email == 1 ? true : false"
            @change="changeSendEmail"
             :disabled="form.mode == 'seen' ? true : false"
          />
        </a-form-item>
        <a-upload
          v-model:file-list="form.list_files"
          name="file"
          list-type="text"
          :show-upload-list="true"
          :customRequest="customRequest"
          @change="handleChange"
        >
          <a-button  :disabled="form.mode == 'seen' ? true : false">
            <upload-outlined></upload-outlined>
            {{ t("common.import.upload_file") }}
          </a-button>
        </a-upload>
      </a-form>
    </a-modal>
  </a-row>
</template>
<script setup lang="ts">
import moment, { Moment } from "moment";
import {
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
  getCurrentInstance,
} from "vue";
import { message } from "ant-design-vue";
import {
  CalendarOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  UploadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import { useGetList, useDetail } from "@/hooks/events";
import { useUploadMutation } from "@/hooks/file";
import { useSaveMutation, useDeleteMutation } from "@/hooks/events";
import { useMutation, useQueryClient } from "vue-query";
import i18n from "@/lang";
import { ListGridType } from "ant-design-vue/lib/list";
const { t } = i18n.global;
interface DayList {
  key: number;
  title: string;
  date: string;
  listEvent: Array<any>;
}
moment.locale("vi");
const { proxy }: any = getCurrentInstance();
const userId = ref<number>(proxy.$auth.user().id);
const queryClient = useQueryClient();
const useUpload = useUploadMutation();
const useSave = useSaveMutation();
const useDelete = useDeleteMutation();
const createForm = ref<any>();
const form = ref<any>({
  priority: 1,
  is_send_email: 1,
});
const labelCol = ref<any>({ span: 8 });
const wrapperCol = ref<any>({ span: 16 });
const isShowCreate = ref<boolean>(false);
const viewDateType = ref<number>(1);
const viewType = ref<number>(1);
const dateValue = ref<string>(moment().format("DD/MM/YYYY"));
const times = ref<Array<string>>(["morning", "afternoon"]);
const currentWeek = computed(() =>
  moment(dateValue.value, "DD/MM/YYYY").week()
);
const currentYear = computed(() =>
  moment(dateValue.value, "DD/MM/YYYY").year()
);
const currentMonth = computed(() =>
  moment(dateValue.value, "DD/MM/YYYY").format("MM")
);
const dayList = ref<any>([]);
const eventId = ref<number>();
const filterEvent = computed(() => {
  if (dayList.value.length > 0) {
    let filter = {
      start_date: moment(
        `${dayList.value[0].date} 00:00:00`,
        "DD/MM/YYYY HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss"),
      end_date: moment(
        `${dayList.value.slice(-1)[0].date} 23:59:59`,
        "DD/MM/YYYY HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss"),
    };
    return filter;
  } else {
    return null;
  }
});
const { data: listEvents, refetch: refetchList } = useGetList(filterEvent, {
  enabled: computed(() => filterEvent.value !== null),
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  onSuccess: (data) => {
    // setEventForDate(data);
  },
});
const detail = ref<{}>(
  useDetail(eventId, {
    enabled: computed(() => typeof eventId.value !== "undefined"),
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setDetailData(data);
    },
  })
);
const detailInfo = ref<any>({});
onMounted(() => {
  getDayList();
});
const setEventForDate = (data) => {
  debugger;
  if (data.data.errorCode == 0) {
    dayList.value.forEach((p) => (p.listEvent = []));
    let items = JSON.parse(JSON.stringify(data.data.data));
    if (items.length > 0) {
      items.forEach((item: any) => {
        dayList.value.forEach((day: any) => {
          if (
            moment(item.start_time, "YYYY-MM-DD HH:mm:ss").format(
              "DD/MM/YYYY"
            ) == day.date ||
            moment(item.end_time, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") ==
              day.date
          ) {
            if (
              parseInt(
                moment(item.start_time, "YYYY-MM-DD HH:mm:ss").format("HH")
              ) < 12
            ) {
              item.time = "morning";
            } else {
              item.time = "afternoon";
            }
            day.listEvent.push(item);
          }
        });
      });
    }
  }
};
const getDayList = () => {
  let listItem: Array<DayList> = [];
  if (viewDateType.value == 1) {
    for (let i = 1; i <= 7; i++) {
      listItem.push({
        key: i,
        title: moment.weekdays(i),
        date: moment(dateValue.value, "DD/MM/YYYY").day(i).format("DD/MM/YYYY"),
        listEvent: [],
      });
    }
    dayList.value = listItem;
  } else if (viewDateType.value == 2) {
    let count = moment(dateValue.value, "DD/MM/YYYY").daysInMonth();
    for (let i = 1; i <= count; i++) {
      listItem.push({
        key: i,
        title: moment().date(i).format("dddd"),
        date: moment().date(i).format("DD/MM/YYYY"),
        listEvent: [],
      });
    }
    dayList.value = listItem;
  }
  //  setEventForDate(listEvents.value);
};
watchEffect(() => {
  if (listEvents.value) {
    console.log("list", listEvents.value);
    setEventForDate(listEvents.value);
  }
});
const nextDate = () => {
  if (viewDateType.value == 1) {
    let nextWeek = moment(dateValue.value, "DD/MM/YYYY").add(1, "week");
    dateValue.value = nextWeek.format("DD/MM/YYYY");
  } else if (viewDateType.value == 2) {
    let nextWeek = moment(dateValue.value, "DD/MM/YYYY").add(1, "month");
    dateValue.value = nextWeek.format("DD/MM/YYYY");
  }
  getDayList();
};
const prevDate = () => {
  if (viewDateType.value == 1) {
    let prevWeek = moment(dateValue.value, "DD/MM/YYYY").subtract(1, "week");
    dateValue.value = prevWeek.format("DD/MM/YYYY");
  } else if (viewDateType.value == 2) {
    let prevWeek = moment(dateValue.value, "DD/MM/YYYY").subtract(1, "month");
    dateValue.value = prevWeek.format("DD/MM/YYYY");
  }
  getDayList();
};
const showCreateEventForm = (item: any, type: string) => {
  if (type == "morning") {
    form.value.start_time = moment(`${item.date} 07:00`, "DD/MM/YYYY HH:mm");
    form.value.end_time = moment(`${item.date} 12:00`, "DD/MM/YYYY HH:mm");
  } else if (type == "afternoon") {
    form.value.start_time = moment(`${item.date} 12:00`, "DD/MM/YYYY HH:mm");
    form.value.end_time = moment(`${item.date} 18:00`, "DD/MM/YYYY HH:mm");
  }
  console.log(form.start_time);
  isShowCreate.value = true;
};
const closeCreateEventForm = () => {
  isShowCreate.value = false;
  form.value = {
    priority: 1,
    is_send_email: 1,
  };
};
const setDetailData = (data) => {
  if (data.data.errorCode == 0) {
    let detailData = JSON.parse(JSON.stringify(data.data.data));
    let itemAttendee: any = [];
    if (detailData.attendees.length > 0) {
      itemAttendee = detailData.attendees.map((attendee: any) => {
        let item = {
          value: attendee.id,
          label: attendee.name_of_user_id,
        };
        return item;
      });
    }
    detailData.attendees = itemAttendee;
    detailInfo.value = detailData;
    // form.value = detailData;
    // console.log(form);

    // isShowCreate.value = true;
  } else {
    message.error(data.data.errorMessage);
  }
};
const customRequest = (options: any) => {
  const { onSuccess, onError, file } = options;
  useUpload
    .mutateAsync(file)
    .then((response) => {
      onSuccess(response.data.data.file_id);
    })
    .catch((err) => {
      onError(err);
    });
};
const saveForm = (e: any) => {
  e?.preventDefault();
  let payload = JSON.parse(JSON.stringify(form.value));
  payload.start_time = convertDateUTC(form.value.start_time);
  payload.end_time = convertDateUTC(form.value.end_time);
  useSave
    .mutateAsync(payload)
    .then((response?: any) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage
              .map((p?: any) => p.errorMessage)
              .join("\n")
          );
        } else {
          message.error(response.data.errorMessage);
        }
        return false;
      } else {
        debugger;
        const messages: string = t("common.save_success");
        message.success(messages);
        closeCreateEventForm();
      }
    })
    .catch((error?: any) => {
      message.error(error.message);
    });
};
const deleteEvent = (id: number) => {
  useDelete
    .mutateAsync(id)
    .then((response?: any) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage
              .map((p?: any) => p.errorMessage)
              .join("\n")
          );
        } else {
          message.error(response.data.errorMessage);
        }
        return false;
      } else {
        message.success(t("common.delete_success"));
      }
    })
    .catch((error?: any) => {
      message.error(error.message);
    });
};
const convertDateUTC = (date) => {
  return moment(date).utcOffset("GMT+07:00").format();
};
const showEvent = (event) => {
  eventId.value = event.id;
};
const showDetail = () => {
  form.value = detailInfo.value;
  form.value.mode = "seen";
  isShowCreate.value = true;
};
const editDetail = () => {
  form.value = detailInfo.value;
  form.value.mode = "edit";
  isShowCreate.value = true;
};
const changeSendEmail = ($event) => {
  if ($event) {
    form.value.is_send_email = 1;
  } else {
    form.value.is_send_email = 2;
  }
};
const renderCurrentDate = (date: string) => {
  if (date == moment().format("DD/MM/YYYY")) {
    return "current-date";
  } else {
    return "";
  }
};
const renderWeekend = (day: string) => {
  if (day == "thứ bảy" || day == "chủ nhật") {
    return "weekend";
  } else {
    return "";
  }
};
const changeSelectAttendee = ($event) => {
  form.value.attendees = $event.value;
};
const onChangeType = () => {
  console.log("123");
};
const getTime = (time: string, format: string) => {
  return moment(time, "YYYY-MM-DD HH:mm:ss").format(format);
};
</script>
<style lang="scss" scoped>
.container {
  .content {
    padding: 16px 24px;
    .calendar {
      border-top: 1px solid silver;
      .title {
        .time {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid silver;
          border-right: 1px solid silver;
          color: white;
          background: #1890ff;
        }
        .morning {
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-bottom: 1px solid silver;
          border-right: 1px solid silver;
        }
        .afternoon {
          display: flex;
          align-items: center;
          background: white;
          justify-content: center;
          border-bottom: 1px solid silver;
          border-right: 1px solid silver;
        }
      }
      .vertical-title-sticky {
        position: sticky;
        left: 0px;
        z-index: 1;
      }
      .horizontal-title-sticky {
        position: sticky;
        top: 0px;
        z-index: 1;
      }
      .list-day {
        .list-day-content {
          .days {
            .time {
              display: flex;
              align-items: center;
              text-align: center;
              justify-content: center;
              color: white;
              background: #1890ff;
              border-bottom: 1px solid silver;
              border-right: 1px solid silver;
              .time-content {
                display: block;
              }
            }
            .weekend {
              background: red;
            }
            .morning {
              padding: 4px 4px;
              border-bottom: 1px solid silver;
              border-right: 1px solid silver;
            }
            .afternoon {
              padding: 0px 4px;
              border-bottom: 1px solid silver;
              border-right: 1px solid silver;
            }
            .event-item {
              display: flex;
              align-items: center;
            }
            .current-date {
              background: rgba(255, 255, 0, 0.56);
            }
          }
          .vertical-min-width {
            min-width: 200px;
          }
          .vertical-width {
            width: 200px;
          }
        }
        .vertical-display {
          display: flex;
          flex-wrap: inherit;
        }
      }
      .vertical-height {
        height: 160px;
      }
      .horizontal-height {
        height: auto;
      }
    }
    .vertical-month-scroll {
      overflow-x: scroll;
    }
    .horizontal-month-scroll {
      overflow-y: scroll;
    }
    .horizontal-month-max-height {
      max-height: 60vh;
    }
  }
  .border-left {
    border-left: 1px solid silver;
  }
  .height-48 {
    height: 48px;
  }
  .height-auto {
    height: auto;
  }
  .dot {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background: black;
  }
}
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-submit {
  background: #00885a;
  border-color: #00885a;
  width: 120px;
  color: #fff;
}
.btn-cancel {
  border: unset;
}
</style>
