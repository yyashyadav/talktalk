import moment from "moment";

const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop().toLowerCase();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg" || fileExt === "mov" || fileExt === "avi")
    return "video";

  if (fileExt === "mp3" || fileExt === "wav" || fileExt === "m4a" || fileExt === "aac")
    return "audio";

  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "gif" ||
    fileExt === "webp" ||
    fileExt === "svg"
  )
    return "image";

  if (fileExt === "pdf" || fileExt === "doc" || fileExt === "docx" || fileExt === "txt" || fileExt === "xls" || fileExt === "xlsx" || fileExt === "ppt" || fileExt === "pptx")
    return "file";

  return "file";
};

// https://res.cloudinary.com/dj5q966nb/image/upload/dpr_auto/w_200/v1710344436/fafceddc-2845-4ae7-a25a-632f01922b4d.png

// /dpr_auto/w_200
const transformImage = (url = "", width = 100) => {
  if (!url) return "";
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

const getLast7Days = () => {
  const currentDate = moment();

  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    last7Days.unshift(dayName);
  }

  return last7Days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };
