// src/__tests__/admin/TeacherPage.test.jsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TeacherPage from 'src/app/admin/profesores/page'
import Swal from 'sweetalert2'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/profesores',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock('../../app/Service/TeacherService', () => ({
  getTeachersPaginated: jest.fn(),
  searchTeachers: jest.fn(),
  addTeacher: jest.fn(),
  updateTeacher: jest.fn(),
  deleteTeacher: jest.fn(),
}))

jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}))

describe('PageTeachers', () => {
  const { getTeachersPaginated, searchTeachers, deleteTeacher } =
    require('../../app/Service/TeacherService')

  beforeEach(() => {
    jest.clearAllMocks()
    getTeachersPaginated.mockImplementation(async (page, size, setTeachers, setPagination) => {
      setTeachers([
        { idTeacher: 1, name: 'Pedro', lastName: 'P', phoneNumber: '1234567890', email: 'email@email.com' }
      ])
      setPagination({ totalPages: 1, totalElements: 1, currentPage: 0 })
    })
  })

  test('renderiza el título de la página', () => {
  render(<TeacherPage />)
  const heading = screen.getByRole('heading', { name: 'Profesores' })
  expect(heading).toBeInTheDocument()
})


  test('barra de búsqueda dispara searchTeachers', async () => {
    render(<TeacherPage />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Pedro' } })
    expect(input).toHaveValue('Pedro')
    await waitFor(() => {
      expect(searchTeachers).toHaveBeenCalledWith(
        'Pedro',
        0,
        expect.any(Number),
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  test('abre y cierra modal para nuevo profesor', async () => {
  render(<TeacherPage />)
  const addButton = screen.getByText('Nuevo Profesor')
  fireEvent.click(addButton)


  expect(screen.getByText('Cancelar')).toBeInTheDocument()

  const cancelButton = screen.getByText('Cancelar')
  fireEvent.click(cancelButton)

  await waitFor(() => {
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument()
  })
})


  test('tabla muestra profesors cargados', async () => {
    render(<TeacherPage />)
    await waitFor(() => {
      expect(screen.getByText('Pedro')).toBeInTheDocument()
      expect(screen.getByText('email@email.com')).toBeInTheDocument()
    })
  })

  test('paginación llama a fetchTeachers', async () => {
    render(<TeacherPage />)
    const nextButton = screen.getByText('Siguiente')
    fireEvent.click(nextButton)
    await waitFor(() => {
      expect(getTeachersPaginated).toHaveBeenCalled()
    })
    const prevButton = screen.getByText('Anterior')
    fireEvent.click(prevButton)
    await waitFor(() => {
      expect(getTeachersPaginated).toHaveBeenCalled()
    })
  })

  test('eliminar profesor llama a deleteTeacher y Swal', async () => {
    render(<TeacherPage />)
    await waitFor(() => {
      expect(screen.getByText('Pedro')).toBeInTheDocument()
    })
    const deleteButton = screen.getByText('Eliminar')
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled()
      expect(deleteTeacher).toHaveBeenCalledWith(1)
    })
  })
})
