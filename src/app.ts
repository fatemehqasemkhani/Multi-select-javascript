import "../src/styles/main.scss";
import "../assets/items.json";
import "../assets/search.svg";

const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const multiSelectContainer = document.getElementById(
    "multiSelectContainer"
) as HTMLDivElement;

let data: Set<string> = new Set();
let filteredData: Set<string> = new Set();
let selectedData: string[] = [];

async function init() {
    await fetchData();
    loadSelectedData();
    searchData();
    updateHtml();
}

async function fetchData() {
    return await fetch("./assets/items.json")
        .then((response) => response.json())
        .then((res) => {
            data = new Set(res.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function loadSelectedData() {
    const storage = localStorage.getItem("selected");
    if (!!storage) selectedData = JSON.parse(storage);
    else selectedData = [];
}

function saveSelectedData() {
    localStorage.setItem("selected", JSON.stringify(selectedData));
}

function onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
        selectedData.push(checkbox.value);
    } else {
        selectedData = selectedData.filter(item => item !== checkbox.value);
    }
    saveSelectedData();
    updateHtml();
}

function searchData() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredData = new Set<string>();
    if (!!data)
        data.forEach((item) => {
            if (item?.toLowerCase().includes(searchTerm)) filteredData.add(item);
        });
    updateHtml();
}

function updateHtml() {
    multiSelectContainer.innerHTML = "";
    selectedData.forEach((item) => {
        const option = createOptionElement(item, true);
        multiSelectContainer.appendChild(option);
    });
    filteredData.forEach((item) => {
        if (selectedData.includes(item)) return;
        const option = createOptionElement(item, false);
        multiSelectContainer.appendChild(option);
    });
}

function createOptionElement(text: string, value: boolean): HTMLElement {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = text;
    checkbox.checked = value;
    checkbox.addEventListener("change", onCheckboxChange);

    const label = document.createElement("label");
    label.className = "input-label";
    label.textContent = text;
    label.appendChild(checkbox);

    const span = document.createElement("span");
    span.className = "input-check";
    label.appendChild(span);

    return label;
}

searchInput.addEventListener("input", searchData);

init();