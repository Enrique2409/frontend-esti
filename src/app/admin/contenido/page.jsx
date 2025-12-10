"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import Swal from "sweetalert2";

import {
  getAllContent,
  createContent,
  updateContent,
} from "@/app/Service/ContentService";

export default function PageContent() {
  const [contents, setContents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const CATEGORY_MAP = {
    Carrusel: "Carrusel",
    Cartas: "Cards",
    Noticias: "News",
    Nosotros: "We",
    Inscripción: "Register",
    Contacto: "Contact",
  };
  const CATEGORY_LABELS = Object.keys(CATEGORY_MAP);


  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    state: true,
    link: "",
    image: null,
  });

  useEffect(() => {
    fetchContent();
  }, [searchTerm]);

  const fetchContent = async () => {
    await getAllContent(setContents);
  };


  const handleOpenModal = (content = null) => {
    if (content) {
      const label = Object.keys(CATEGORY_MAP).find(
        (key) => CATEGORY_MAP[key] === content.category
      );

      setFormData({
        id: content.id,
        title: content.title,
        description: content.description,
        category: content.category,
        categoryLabel: label || "",
        state: content.state,
        link: content.link,
        image: null,
        previewImage: content.imageURL || null,
      });
    } else {
      resetForm();
    }

    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      category: "",
      categoryLabel: "",
      state: true,
      link: "",
      image: null,
      previewImage: null,
    });
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "categoryLabel") {
      setFormData({
        ...formData,
        categoryLabel: value,
        category: CATEGORY_MAP[value],
      });
      return;
    }

    if (files) {
      const file = files[0];
      setFormData({
        ...formData,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("state", formData.state);
    data.append("link", formData.link);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (formData.id) {
        await updateContent(formData.id, data);
      } else {
        await createContent(data);
      }

      Swal.fire("Éxito", "Contenido guardado correctamente", "success");
      handleCloseModal();
      fetchContent();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el contenido", "error");
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Gestión de Contenido"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo Contenido"
        />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
          {/**  <SearchBar onSearch={setSearchTerm} />*/} 

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["ID", "Título", "Categoría", "Estado", "Acciones"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {contents.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Object.keys(CATEGORY_MAP).find(
                          (key) => CATEGORY_MAP[key] === item.category
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.state ? "Activo" : "Inactivo"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.id ? "Editar Contenido" : "Nuevo Contenido"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título"
            className="w-full border p-2"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border p-2"
          />

          <select
            name="categoryLabel"
            value={formData.categoryLabel}
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORY_LABELS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>

          {formData.previewImage && (
            <img
              src={formData.previewImage}
              alt="Preview"
              className="w-full h-40 object-contain border rounded-md mt-2"
            />
          )}

          <input type="file" name="image" onChange={handleChange} />

          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white"
            >
              {formData.id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
