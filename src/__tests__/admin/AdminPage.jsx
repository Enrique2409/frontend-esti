// src/__tests__/admin/AdminPage.test.jsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminPage from 'src/app/admin/administradores/page'
import Swal from 'sweetalert2'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/administradores',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock('../../app/Service/AdminService', () => ({
  getAdminsPaginated: jest.fn(),
  searchAdmins: jest.fn(),
  addAdmin: jest.fn(),
  updateAdmin: jest.fn(),
  deleteAdmin: jest.fn(),
}))

jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}))

describe('PageAdmins', () => {
  const { getAdminsPaginated, searchAdmins, deleteAdmin } =
    require('../../app/Service/AdminService')

  beforeEach(() => {
    jest.clearAllMocks()
    getAdminsPaginated.mockImplementation(async (page, size, setAdmins, setPagination) => {
      setAdmins([
        { idAdmin: 1, name: 'Jesus', lastName: 'P', phoneNumber: '1234567890', email: 'email@email.com' }
      ])
      setPagination({ totalPages: 1, totalElements: 1, currentPage: 0 })
    })
  })

  test('renderiza el título de la página', () => {
  render(<AdminPage />)
  const heading = screen.getByRole('heading', { name: 'Administradores' })
  expect(heading).toBeInTheDocument()
})


  test('barra de búsqueda dispara searchAdmins', async () => {
    render(<AdminPage />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Jesus' } })
    expect(input).toHaveValue('Jesus')
    await waitFor(() => {
      expect(searchAdmins).toHaveBeenCalledWith(
        'Jesus',
        0,
        expect.any(Number),
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  test('abre y cierra modal para nuevo administrador', async () => {
  render(<AdminPage />)
  const addButton = screen.getByText('Nuevo Administrador')
  fireEvent.click(addButton)


  expect(screen.getByText('Cancelar')).toBeInTheDocument()

  const cancelButton = screen.getByText('Cancelar')
  fireEvent.click(cancelButton)

  await waitFor(() => {
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument()
  })
})


  test('tabla muestra administradores cargados', async () => {
    render(<AdminPage />)
    await waitFor(() => {
      expect(screen.getByText('Jesus')).toBeInTheDocument()
      expect(screen.getByText('email@email.com')).toBeInTheDocument()
    })
  })

  test('paginación llama a fetchAdmins', async () => {
    render(<AdminPage />)
    const nextButton = screen.getByText('Siguiente')
    fireEvent.click(nextButton)
    await waitFor(() => {
      expect(getAdminsPaginated).toHaveBeenCalled()
    })
    const prevButton = screen.getByText('Anterior')
    fireEvent.click(prevButton)
    await waitFor(() => {
      expect(getAdminsPaginated).toHaveBeenCalled()
    })
  })

  test('eliminar administrador llama a deleteAdmin y Swal', async () => {
    render(<AdminPage />)
    await waitFor(() => {
      expect(screen.getByText('Jesus')).toBeInTheDocument()
    })
    const deleteButton = screen.getByText('Eliminar')
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled()
      expect(deleteAdmin).toHaveBeenCalledWith(1)
    })
  })
})
