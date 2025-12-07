let pageSize = 1024;

function selectPageSize(size, event) {
  pageSize = size;
  const buttons = document.querySelectorAll(".btn-size");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.classList.add("show");
  document.getElementById("results").classList.remove("show");
}

function hideError() {
  document.getElementById("errorMessage").classList.remove("show");
}

function translateAddress(logicalAddress, pageSize, pageTable) {
  const pageNumber = Math.floor(logicalAddress / pageSize);
  const offset = logicalAddress % pageSize;

  if (pageNumber >= 8) {
    return {
      logicalAddress,
      pageNumber,
      offset,
      error: `Invalid page number (exceeds 8 pages)`,
    };
  }

  if (!(pageNumber in pageTable)) {
    return {
      logicalAddress,
      pageNumber,
      offset,
      pageFault: true,
      message: "Page Fault - Page not in page table",
    };
  }

  const frameNumber = pageTable[pageNumber];

  if (frameNumber === -1) {
    return {
      logicalAddress,
      pageNumber,
      frameNumber: "N/A",
      offset,
      pageFault: true,
      message: "Page Fault - Page not loaded in memory",
    };
  }

  const physicalAddress = frameNumber * pageSize + offset;

  return {
    logicalAddress,
    pageNumber,
    frameNumber,
    offset,
    physicalAddress,
    pageFault: false,
  };
}

function validateDictionaryFormat(input) {
  // Remove whitespace for checking
  const trimmed = input.trim();

  // Check if it starts with { and ends with }
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return {
      valid: false,
      message: "Page table must be in dictionary format: {key: value, ...}",
    };
  }

  // Check for common mistakes
  if (trimmed.startsWith("[") || trimmed.endsWith("]")) {
    return {
      valid: false,
      message: "Page table should use curly braces { } not square brackets [ ]",
    };
  }

  return { valid: true };
}

function validateListFormat(input) {
  // Remove whitespace for checking
  const trimmed = input.trim();

  // Check if it starts with [ and ends with ]
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return {
      valid: false,
      message:
        "Logical addresses must be in list format: [value1, value2, ...]",
    };
  }

  // Check for common mistakes
  if (trimmed.startsWith("{") || trimmed.endsWith("}")) {
    return {
      valid: false,
      message:
        "Logical addresses should use square brackets [ ] not curly braces { }",
    };
  }

  return { valid: true };
}

function translateAddresses() {
  hideError();

  try {
    // Get inputs
    const pageTableInput = document.getElementById("pageTable").value.trim();
    const addressesInput = document.getElementById("addresses").value.trim();

    // Check for empty inputs
    if (!pageTableInput) {
      showError("Please enter a page table");
      return;
    }

    if (!addressesInput) {
      showError("Please enter logical addresses");
      return;
    }

    // Validate page table format
    const dictValidation = validateDictionaryFormat(pageTableInput);
    if (!dictValidation.valid) {
      showError(dictValidation.message);
      return;
    }

    // Validate addresses format
    const listValidation = validateListFormat(addressesInput);
    if (!listValidation.valid) {
      showError(listValidation.message);
      return;
    }

    // Parse page table
    let pageTable;
    try {
      pageTable = eval(`(${pageTableInput})`);
    } catch (e) {
      showError(
        "Invalid page table format. Check for syntax errors (missing commas, colons, etc.)"
      );
      return;
    }

    if (typeof pageTable !== "object" || Array.isArray(pageTable)) {
      showError(
        "Page table must be a valid dictionary/object. Example: {0: 2, 1: -1, 2: 4}"
      );
      return;
    }

    // Check if page table is empty
    if (Object.keys(pageTable).length === 0) {
      showError(
        "Page table cannot be empty. Please add at least one page-frame mapping"
      );
      return;
    }

    // Validate page table entries
    const usedFrames = new Set();
    for (let [page, frame] of Object.entries(pageTable)) {
      const p = parseInt(page);
      const f = parseInt(frame);

      if (isNaN(p) || isNaN(f)) {
        showError(
          `Invalid page table entry: ${page}: ${frame}. Both must be numbers`
        );
        return;
      }
      if (p < 0 || p >= 8) {
        showError(`Page ${p} is invalid. Pages must be between 0 and 7`);
        return;
      }
      if (f !== -1 && (f < 0 || f > 5)) {
        showError(
          `Frame ${f} is invalid. Frames must be between 0 and 5, or -1 for not loaded`
        );
        return;
      }

      // Check for duplicate frame mappings (only for loaded frames)
      if (f !== -1) {
        if (usedFrames.has(f)) {
          showError(
            `Frame ${f} is already assigned to another page. Each frame can only be assigned to one page at a time`
          );
          return;
        }
        usedFrames.add(f);
      }
    }

    // Parse addresses
    let addresses;
    try {
      addresses = eval(`(${addressesInput})`);
    } catch (e) {
      showError(
        "Invalid addresses format. Check for syntax errors (missing commas, brackets, etc.)"
      );
      return;
    }

    if (!Array.isArray(addresses)) {
      showError(
        "Logical addresses must be a valid list/array. Example: [0, 512, 1500, 2048]"
      );
      return;
    }

    if (addresses.length === 0) {
      showError(
        "Address list cannot be empty. Please enter at least one logical address"
      );
      return;
    }

    if (addresses.length > 10) {
      showError(
        `Too many addresses! Maximum 10 allowed, you entered ${addresses.length}`
      );
      return;
    }

    // Validate addresses
    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i];
      if (typeof addr !== "number") {
        showError(`Address at position ${i + 1} is not a number: ${addr}`);
        return;
      }
      if (addr < 0) {
        showError(
          `Address at position ${
            i + 1
          } is negative: ${addr}. Addresses must be non-negative`
        );
        return;
      }
      if (!Number.isInteger(addr)) {
        showError(`Address at position ${i + 1} is not an integer: ${addr}`);
        return;
      }
    }

    // Translate all addresses
    const results = addresses.map((addr) =>
      translateAddress(addr, pageSize, pageTable)
    );
    displayResults(results);
  } catch (e) {
    showError(`Unexpected error: ${e.message}. Please check your input format`);
  }
}

function displayResults(results) {
  const resultsDiv = document.getElementById("results");

  let html = "<h2>Translation Results</h2>";

  // Display each result
  results.forEach((result, index) => {
    const type = result.error
      ? "error"
      : result.pageFault
      ? "fault"
      : "success";
    const status = result.error
      ? "ERROR"
      : result.pageFault
      ? "PAGE FAULT"
      : "SUCCESS";

    html += `
                    <div class="result-card ${type}">
                        <div class="result-header">
                            <div class="result-title">Address #${
                              index + 1
                            }</div>
                            <div class="badge ${type}">${status}</div>
                        </div>
                        <div class="result-grid">
                            <div class="result-item">
                                Logical Address:
                                <div class="result-value">${
                                  result.logicalAddress
                                }</div>
                            </div>
                            <div class="result-item">
                                Page Number:
                                <div class="result-value">${
                                  result.pageNumber
                                }</div>
                            </div>
                            <div class="result-item">
                                Offset:
                                <div class="result-value">${result.offset}</div>
                            </div>
                            ${
                              !result.error
                                ? `
                                <div class="result-item">
                                    Frame Number:
                                    <div class="result-value">${
                                      result.frameNumber
                                    }</div>
                                </div>
                                <div class="result-item">
                                    Physical Address:
                                    <div class="result-value">${
                                      result.physicalAddress ?? "N/A"
                                    }</div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                        ${
                          result.error || result.message
                            ? `
                            <div class="result-message" style="color: ${
                              result.error ? "#991b1b" : "#854d0e"
                            }">
                                ${result.error || result.message}
                            </div>
                        `
                            : ""
                        }
                    </div>
                `;
  });

  // Summary
  const successful = results.filter((r) => !r.pageFault && !r.error).length;
  const faults = results.filter((r) => r.pageFault).length;
  const errors = results.filter((r) => r.error).length;

  html += `
                <div class="summary">
                    <h3>Summary</h3>
                    <div class="summary-grid">
                        <div class="summary-card success">
                            <div class="summary-number">${successful}</div>
                            <div class="summary-label">Successful</div>
                        </div>
                        <div class="summary-card fault">
                            <div class="summary-number">${faults}</div>
                            <div class="summary-label">Page Faults</div>
                        </div>
                        <div class="summary-card error">
                            <div class="summary-number">${errors}</div>
                            <div class="summary-label">Errors</div>
                        </div>
                    </div>
                </div>
            `;

  resultsDiv.innerHTML = html;
  resultsDiv.classList.add("show");
}
