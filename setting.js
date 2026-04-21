const themes = {
  default: {
    name: "Default",
    classes: {
      sidebar: ["bg-gray-50", "border-gray-200", "dark:border-[#1E3E62]"],
      sections: ["dark:bg-[#0B192C]"],
      upcomingBorders: ["dark:border-[#1E3E62]"],
      editForm: ["bg-white", "dark:bg-[#0B192C]", "dark:border-[#1E3E62]"],
      editInputs: ["bg-gray-200", "dark:bg-[#1E3E62]"],
      cancelBtn: ["bg-gray-200", "dark:bg-[#1E3E62]"],
    },
  },
  blue: {
    name: "Blue",
    classes: {
      sidebar: ["bg-blue-50", "border-blue-200", "dark:border-blue-800"],
      sections: [
        "bg-gradient-to-b",
        "from-blue-50",
        "dark:from-blue-950",
        "dark:to-blue-700",
      ],
      upcomingBorders: ["dark:border-blue-500"],
      editForm: ["bg-blue-50", "dark:bg-blue-950", "dark:border-blue-800"],
      editInputs: ["bg-blue-200", "dark:bg-blue-900"],
      cancelBtn: ["bg-blue-200", "dark:bg-blue-900"],
    },
  },
};

function replaceClasses(element, oldClasses, newClasses) {
  if (!element) return;
  if (oldClasses) element.classList.remove(...oldClasses);
  element.classList.add(...newClasses);
}

let currentThemeName = "default";

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme || themeName === currentThemeName) return;

  const prevTheme = themes[currentThemeName];

  const sidebar = document.querySelector("#sideBar");
  replaceClasses(sidebar, prevTheme?.classes.sidebar, theme.classes.sidebar);

  document.querySelectorAll(".todoSection").forEach((el) => {
    replaceClasses(el, prevTheme?.classes.sections, theme.classes.sections);
  });

  const upcomingBordersEls = document.querySelectorAll(".upcomingTasks");
  upcomingBordersEls.forEach(border => {
    replaceClasses(
    border,
    prevTheme?.classes.upcomingBorders,
    theme.classes.upcomingBorders
  );
  })
  

  const editForm = document.getElementById("editTaskForm");
  if (editForm) {
    replaceClasses(
      editForm,
      prevTheme?.classes.editForm,
      theme.classes.editForm
    );
  }

  const inputs = [
    document.getElementById("taskInput_E"),
    document.getElementById("taskTextarea_E"),
  ];
  inputs.forEach((input) => {
    if (input) {
      replaceClasses(
        input,
        prevTheme?.classes.editInputs,
        theme.classes.editInputs
      );
    }
  });

  const cancelBtn = document.querySelector(".cancelBtn");
  replaceClasses(
    cancelBtn,
    prevTheme?.classes.cancelBtn,
    theme.classes.cancelBtn
  );

  currentThemeName = themeName;

  localStorage.setItem("preferredTheme", themeName);
}

const settingPanel = document.querySelector("[data-setting-panel]");
const setting = document.querySelector("[data-setting]");
const openSettingBtn = document.getElementById("openSettingBtn");
const closeSettingBtn = document.getElementById("closeSettingBtn");

const colors = document.querySelectorAll("[data-key]");

function closeSetting() {
  settingPanel.classList.add("hidden");
}

setting.addEventListener("click", (e) => {
  e.stopPropagation();
});

openSettingBtn.addEventListener("click", () => {
  settingPanel.classList.remove("hidden");
});

settingPanel.addEventListener("click", closeSetting);
closeSettingBtn.addEventListener("click", closeSetting);

const active = ["border-2", "border-[#FF6500]"];

function activeMode(btns) {
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => {
        b.classList.remove(...active);
      });
      btn.classList.add(...active);
      const theme = btn.dataset.key;
      applyTheme(theme);
    });
  });
}

activeMode(colors);

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("preferredTheme") || "default";
  applyTheme(saved);

  colors.forEach((color) => {
    if (color.dataset.key === saved) {
      color.classList.add(...active);
    } else {
      color.classList.remove(...active);
    }
  });
});