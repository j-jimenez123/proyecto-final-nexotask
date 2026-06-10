export const priorities = ["baja", "media", "alta"];

export function cleanText(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

export function cleanPriority(value) {
  return priorities.includes(value) ? value : "media";
}

export function isValidDate(value) {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isValidTime(value) {
  return value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function cleanTaskInput(body) {
  const title = cleanText(body.title, 120);
  const description = cleanText(body.description, 500);
  const dueDate = cleanText(body.dueDate, 10);
  const dueTime = cleanText(body.dueTime, 5);
  const priority = cleanPriority(body.priority);

  if (!title) {
    return { error: "El titulo es obligatorio" };
  }

  if (!isValidDate(dueDate)) {
    return { error: "La fecha no tiene un formato valido" };
  }

  if (!isValidTime(dueTime)) {
    return { error: "La hora no tiene un formato valido" };
  }

  return {
    task: {
      title,
      description,
      dueDate,
      dueTime,
      priority,
    },
  };
}
