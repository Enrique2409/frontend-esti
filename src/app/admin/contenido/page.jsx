"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  getAllContent,
  createContent,
  updateContent,
} from "@/app/Service/ContentService";

export default function PageContent() {
  const [contents, setContents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    getAllContent(setContents);
  }, []);

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      category: "",
      state: true,
      link: "",
      image: null,
    });
  };

  const openModal = (content = null) => {
    if (content) {
      setFormData({ ...content, image: null });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      if (formData.id) {
        await updateContent(formData.id, data);
      } else {
        await createContent(data);
      }

      Swal.fire("Éxito", "Contenido guardado correctamente", "success");
      closeModal();
      getAllContent(setContents);
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el contenido", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="min-h-screen bg-white px-6 py-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestión de Contenido</h1>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Nuevo Contenido
          </button>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["ID", "Título", "Categoría", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contents.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">
                    {item.state ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(item)}
                      className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Contenido">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" placeholder="Título" className="w-full border p-2" onChange={handleChange} />
          <textarea name="description" placeholder="Descripción" className="w-full border p-2" onChange={handleChange} />
          <input name="category" placeholder="Categoría" className="w-full border p-2" onChange={handleChange} />
          <input name="link" placeholder="Enlace opcional" className="w-full border p-2" onChange={handleChange} />
          <input type="file" name="image" onChange={handleChange} />

          <select name="state" onChange={handleChange} className="w-full border p-2">
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 border">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
