import React, { useState, useEffect } from "react";
import { getEmailLayout, uploadImage, renderAndDownloadTemplate } from "../services/api";
import './EmailEditor.css'; // import the CSS file

const EmailEditor = () => {
  const [layout, setLayout] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    footer: "",
    imageUrls: [],
  });

  useEffect(() => {
    getEmailLayout().then((res) => setLayout(res.data));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("image", file);

    const res = await uploadImage(form);
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, res.data.imageUrl] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderTemplate = () => {
    let updatedLayout = layout;
    updatedLayout = updatedLayout.replace("{{title}}", formData.title)
                                  .replace("{{content}}", formData.content)
                                  .replace("{{footer}}", formData.footer)
                                  .replace("{{imageUrls}}", formData.imageUrls.map(url => `<img src="${url}" />`).join(""));
    return updatedLayout;
  };

  const handleDownload = async () => {
    const res = await renderAndDownloadTemplate(formData);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "email-template.html");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="email-editor-container">
      <div className="email-preview">
        {/* Render the email template dynamically */}
        <div dangerouslySetInnerHTML={{ __html: renderTemplate() }}></div>
      </div>

      <div className="email-form">
        {/* Input fields for title, content, and footer */}
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="email-input"
        />
        <textarea
          placeholder="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="email-textarea"
        ></textarea>
        <input
          type="text"
          placeholder="Footer"
          name="footer"
          value={formData.footer}
          onChange={handleChange}
          className="email-input"
        />
        <input type="file" onChange={handleImageUpload} className="email-file-input" />
        {/* <button onClick={handleSubmit} className="email-button">Save</button> */}
        <button onClick={handleDownload} className="email-button">Download</button>
      </div>
    </div>
  );
};

export default EmailEditor;
