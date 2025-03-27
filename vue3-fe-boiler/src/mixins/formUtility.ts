export const changeEntity = ($event:any, formState:any, entity:string) => {
    if ($event.value) {
      formState[entity] = $event.value;
      formState[entity + "_ids"] = $event.value?.key;
      formState[entity].tagName = $event.value?.label?.children;
    } 
    else {
      formState[entity] = {
        key: null,
        value: null,
        tagName: null,
        label: null,
      };
      formState[entity + "_ids"] = null;
    }
  }