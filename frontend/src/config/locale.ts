import moment from "moment/min/moment-with-locales";

// Moment.js 한국어 locale 설정
moment.locale("ko");

// 한국어 날짜 포매터
export const formatDate = {
  // 기본 날짜/시간 포맷
  dateTime: (date: string | Date) =>
    moment(date).format("YYYY년 MM월 DD일 HH:mm A"),

  // 짧은 날짜/시간 포맷
  short: (date: string | Date) => moment(date).format("MM/DD HH:mm"),

  // 상대 시간 (예: "3시간 전", "2일 전")
  fromNow: (date: string | Date) => moment(date).fromNow(),

  // 캘린더 형식 (예: "오늘 오후 2:30", "어제 오전 9:15")
  calendar: (date: string | Date) => moment(date).calendar(),

  // 커스텀 포맷
  format: (date: string | Date, format: string) => moment(date).format(format),
};

export default moment;
