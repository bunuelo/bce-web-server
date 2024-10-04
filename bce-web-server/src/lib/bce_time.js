export const zero_pad = function (num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
};

export const format_date = function (date) {
  if (date == null) {
    return "";
  }
  let am_pm = date.getHours() < 12 ? "am" : "pm"
  var am_pm_hours = date.getHours() % 12
  if (am_pm_hours == 0) {
    am_pm_hours = 12;
  }
  var final_string = ""
  let now = new Date()
  if (now.getFullYear() != date.getFullYear()) {
    final_string += "" + date.getFullYear() + "-"
  }
  if (now.getDate() != date.getDate() || now.getMonth() != date.getMonth() || now.getFullYear() != date.getFullYear()) {
    final_string += zero_pad(date.getMonth() + 1, 2) + "-" + zero_pad(date.getDate(), 2) + " "
  }
  final_string += am_pm_hours + ":" + zero_pad(date.getMinutes(), 2) + ":" + zero_pad(date.getSeconds(), 2) + " " + am_pm
  return final_string
}

export const format_time_since_date = function (date) {
  if (date == null) {
    return "";
  }
  var final_string = "";
  let now = new Date();
  let total_seconds = (now.getTime() - date.getTime()) / 1000.0;
  var seconds = Math.round(total_seconds);
  var hours = 0;
  var minutes = 0;
  while (seconds >= 3600) {
    seconds -= 3600;
    hours ++;
  }
  while (seconds >= 60) {
    seconds -= 60;
    minutes ++;
  }
  if (hours > 0) {
    final_string += "" + hours + ":"
  }
  if (minutes > 0 || hours != 0) {
    if (hours == 0) {
      final_string += "" + minutes + ":"
    } else {
      final_string += "" + zero_pad(minutes, 2) + ":"
    }
  }
  if (seconds > 0 || hours != 0 || minutes != 0 || (minutes == 0 && hours == 0)) {
    if (hours == 0 && minutes == 0) {
      final_string += "" + Math.round(seconds)
    } else {
      final_string += "" + zero_pad(Math.round(seconds), 2)
    }
  }
  return final_string
}

export const format_json_datetime = function (json_datetime) {
  let date = new Date(json_datetime + "Z")
  return format_date(date)
}

export const format_time_since_json_datetime = function (json_datetime) {
  let date = new Date(json_datetime + "Z")
  return format_time_since_date(date)
}

