// src/__tests__/teacher/StudentPage.test.jsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import StudentPage from 'src/app/profesor/alumnos/page'
import Swal from 'sweetalert2'

// 🔹 Mock de next/navigation para que Navbar no truene
jest.mock('next/navigation', () => ({
  usePathname: () => '/profesor/alumnos',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// 🔹 Mock de StudentService
jest.mock('../../app/Service/StudentService', () => ({
  getStudentsPaginated: jest.fn(),
  searchStudents: jest.fn(),
  createStudent: jest.fn(),
  updateStudent: jest.fn(),
  deleteStudent: jest.fn(),
}))

// 🔹 Mock de Swal para no mostrar alertas reales
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}))

describe('PageStudents', () => {
  const { getStudentsPaginated, searchStudents, deleteStudent } =
    require('../../app/Service/StudentService')

  beforeEach(() => {
    // Resetear mocks antes de cada test
    jest.clearAllMocks()
    getStudentsPaginated.mockImplementation(async (page, size, setStudents, setPagination) => {
      setStudents([
        { idStudent: 1, name: 'Juan', lastNamePaternal: 'P', lastNameMaternal: 'M', curp: 'CURP1', birthDate: '2000-01-01', phoneNumber: '1234567890' }
      ])
      setPagination({ totalPages: 1, totalElements: 1, currentPage: 0 })
    })
  })

  test('renderiza el título de la página', () => {
    render(<StudentPage />)
    expect(screen.getByText('Estudiantes')).toBeInTheDocument()
  })

  test('barra de búsqueda dispara searchStudents', async () => {
    render(<StudentPage />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Juan' } })
    expect(input).toHaveValue('Juan')
    await waitFor(() => {
      expect(searchStudents).toHaveBeenCalledWith(
        'Juan',
        0,
        expect.any(Number),
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  test('abre y cierra modal para nuevo estudiante', async () => {
    render(<StudentPage />)
    const addButton = screen.getByText('Nuevo Estudiante')
    fireEvent.click(addButton)
    expect(screen.getByText('Nuevo estudiante')).toBeInTheDocument()
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    await waitFor(() => {
      expect(screen.queryByText('Nuevo estudiante')).not.toBeInTheDocument()
    })
  })

  test('tabla muestra estudiantes cargados', async () => {
    render(<StudentPage />)
    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument()
      expect(screen.getByText('CURP1')).toBeInTheDocument()
    })
  })

  test('paginación llama a fetchStudents', async () => {
    render(<StudentPage />)
    const nextButton = screen.getByText('Siguiente')
    fireEvent.click(nextButton)
    await waitFor(() => {
      expect(getStudentsPaginated).toHaveBeenCalled()
    })
    const prevButton = screen.getByText('Anterior')
    fireEvent.click(prevButton)
    await waitFor(() => {
      expect(getStudentsPaginated).toHaveBeenCalled()
    })
  })

  test('eliminar estudiante llama a deleteStudent y Swal', async () => {
    render(<StudentPage />)
    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument()
    })
    const deleteButton = screen.getByText('Eliminar')
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled()
      expect(deleteStudent).toHaveBeenCalledWith(1)
    })
  })
})
