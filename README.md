# Page Table Translator

A web-based simulation tool that demonstrates how logical addresses are converted into physical addresses using page tables in operating systems. This project implements virtual memory address translation with a clean **Model-View-Controller (MVC)** architecture.

![Language](https://img.shields.io/badge/Language-JavaScript-yellow)

---

## 🎯 **Features**

- ✅ **Address Translation** - Convert logical addresses to physical addresses using page tables
- ✅ **Page Fault Detection** - Identifies when pages are not loaded in memory
- ✅ **Input Validation** - Comprehensive error checking with helpful messages
- ✅ **Duplicate Frame Detection** - Prevents multiple pages from mapping to the same frame
- ✅ **Visual Results** - Color-coded cards showing success, page faults, and errors
- ✅ **Summary Statistics** - Quick overview of translation results
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **MVC Architecture** - Clean separation of concerns for maintainability


## 🚀 **Getting Started**

### **Prerequisites**
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required!

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/page-table-translator.git
   cd page-table-translator
   ```

2. **Open in browser:**
   ```bash
   # Simply open index.html in your browser
   open index.html
   # or
   start index.html
   # or double-click the file
   ```

That's it! No build process, no dependencies, no server needed.

---

## ⚠️ **Validation Rules**

### **Page Table Constraints:**
- ✅ Must use dictionary format: `{key: value}`
- ✅ Pages must be 0-7
- ✅ Frames must be 0-5 or -1
- ❌ Cannot have duplicate frame assignments
- ❌ Cannot be empty

### **Logical Addresses Constraints:**
- ✅ Must use list format: `[value1, value2]`
- ✅ Maximum 10 addresses
- ✅ Must be non-negative integers
- ❌ Cannot be empty
- ❌ Cannot contain decimals or negative numbers

---

## 🎨 **Color Coding**

The interface uses intuitive color coding:

- 🟢 **Green** - Successful translation
- 🟡 **Yellow** - Page fault (page not loaded)
- 🔴 **Red** - Error (invalid input or page number)

---

## 🛠️ **Technologies Used**

- **HTML5** - Structure and semantics
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript (ES6+)** - Logic and interactivity
- **MVC Pattern** - Architectural design

**No frameworks. No dependencies. Pure web technologies.**

---

## 📚 **Educational Purpose**

This project is designed to help students understand:

- 📖 **Virtual Memory** - How operating systems manage memory
- 📖 **Paging** - Memory management technique
- 📖 **Address Translation** - Logical to physical address conversion
- 📖 **Page Faults** - What happens when pages aren't in memory
- 📖 **Page Tables** - Data structure for address mapping
- 📖 **MVC Architecture** - Software design pattern

---

## 📝 **Project Requirements**

This project was developed to meet the following specifications:

- ✅ One-level paging only (no multi-level page tables)
- ✅ Logical address space: Maximum 8 pages
- ✅ Page size: Fixed at 512 bytes or 1 KB
- ✅ Physical frames: Limited to 4-6 frames (0-5)
- ✅ Maximum 10 logical addresses per translation
- ✅ Page table entries can be predefined or manually input
- ✅ Display: Logical Address, Page Number, Frame Number, Offset, Physical Address
- ✅ Page fault detection and messaging


---

## ⭐ **Show Your Support**

If you found this project helpful, please give it a ⭐ on GitHub!
