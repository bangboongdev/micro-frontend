import { formatDate, validateImageFile, getImage } from "@/mixins/utility";
import FileService from "@/services/FileService";
import { ref } from "vue";
function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

export function useUpload() {
  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    type?: string;
    size: number;
    originFileObj: any;
  }
  interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
  }
  const fileList = ref([]);
  const uploadLoading = ref(false);
  const imageUrl = ref<string>("");
  const file_id = ref<any>("");

  const beforeUpload = (file: FileItem) => {
    return validateImageFile(file, onmessage);
  };
  const customRequest = (options: any) => {
    const { onSuccess, onError, file } = options;
    FileService.upload(file)
      .then((response) => {
        onSuccess(response.data.data.file_id);
      })
      .catch((err) => {
        onError(err);
      });
  };
  const handleChange = (info: FileInfo) => {
    if (info.file.status === "uploading") {
      uploadLoading.value = true;
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (base64Url) => {
        imageUrl.value = base64Url;
        uploadLoading.value = false;
        file_id.value = info.file.response;
        console.log(file_id.value);

        // store.commit("company/SET_ITEM_FORM", form);
      });
    }
    if (info.file.status === "error") {
      uploadLoading.value = false;
      // $message.error("upload error");
    }
  };
  return {
    uploadLoading,
    imageUrl,
    file_id,
    fileList,
    customRequest,
    handleChange,
    beforeUpload,
  };
}
