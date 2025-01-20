const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const footerInput = document.getElementById("footer");
const imagesInput = document.getElementById("images");
const previewFrame = document.getElementById("preview");
const generateTemplateButton = document.getElementById("generateTemplate");

// Load the email template layout
let emailTemplate = "";
fetch("layout.html")
  .then((response) => response.text())
  .then((template) => {
    emailTemplate = template;
    updatePreview(); // Initialize preview with empty fields
  })
  .catch((error) => console.error("Error loading the template:", error));

// Convert files to Base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Update the preview dynamically
// async function updatePreview() {
//   if (!emailTemplate) return;

//   const title = titleInput.value || "";
//   const content = contentInput.value || "Your content will appear here.";
//   const footer = footerInput.value || "Your footer will appear here.";
  
//   // Convert image files to Base64
//   const imageUrls = [];
//   if (imagesInput.files.length > 0) {
//     for (const file of imagesInput.files) {
//       const base64 = await getBase64(file);
//       imageUrls.push(`<img src="${base64}" alt="Image">`);
//     }
//   }

//   const imagesHTML = imageUrls.join("");

//   // Replace placeholders
//   const emailHTML = emailTemplate
//     .replace("", title)
//     .replace("{{content}}", content)
//     .replace("{{footer}}", footer)
//     .replace("{{images}}", imagesHTML);

//   // Update the iframe preview
//   const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
//   previewDoc.open();
//   previewDoc.write(emailHTML);
//   previewDoc.close();
// }

async function updatePreview() {
  if (!emailTemplate) return;

  const title = titleInput.value || "Your Title Here";
  const content = contentInput.value || "Your content will appear here.";
  const footer = footerInput.value || "Your footer will appear here.";

  // Convert image files to Base64
  const imageUrls = [];
  if (imagesInput.files.length > 0) {
    for (const file of imagesInput.files) {
      const base64 = await getBase64(file);
      imageUrls.push(`<img src="${base64}" alt="Image">`);
    }
  }

  const imagesHTML = imageUrls.join("");

  // Replace placeholders with every update
  const emailHTML = emailTemplate
    .replace(/{{title}}/g, title) // Use regular expression for global replacement
    .replace("{{content}}", content)
    .replace("{{footer}}", footer)
    .replace("{{images}}", imagesHTML);

  // Update the iframe preview
  const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  previewDoc.open();
  previewDoc.write(emailHTML);
  previewDoc.close();
}

// Add event listeners for live updates
titleInput.addEventListener("input", updatePreview);
contentInput.addEventListener("input", updatePreview);
footerInput.addEventListener("input", updatePreview);
imagesInput.addEventListener("change", updatePreview);

// Generate and download the email template
generateTemplateButton.addEventListener("click", async () => {
  const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  const emailHTML = previewDoc.documentElement.outerHTML;

  // Create a Blob for the HTML
  const blob = new Blob([emailHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "email-template.html";
  a.click();

  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
});
