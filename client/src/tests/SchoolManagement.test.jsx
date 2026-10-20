// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import SchoolManagement from '../pages/SchoolManagement'

const schoolState = {
  allSchools: [],
  loading: false,
  error: '',
  createSchool: vi.fn(),
  renameSchool: vi.fn(),
  setSchoolActive: vi.fn(),
}

vi.mock('../context/SchoolsContext', () => ({
  useSchools: () => schoolState,
}))

beforeEach(() => {
  schoolState.allSchools = [
    { id: 'school_alpha', name: 'Alpha School', active: true },
    { id: 'school_old', name: 'Old School', active: false },
  ]
  schoolState.loading = false
  schoolState.error = ''
  schoolState.createSchool.mockReset().mockResolvedValue({})
  schoolState.renameSchool.mockReset().mockResolvedValue({})
  schoolState.setSchoolActive.mockReset().mockResolvedValue({})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('School Management page', () => {
  test('shows active and inactive schools with their generated IDs', () => {
    render(<SchoolManagement />)

    expect(screen.getByRole('heading', { name: 'School Management' })).toBeInTheDocument()
    expect(screen.getByText('Alpha School')).toBeInTheDocument()
    expect(screen.getByText('ID: school_alpha')).toBeInTheDocument()
    expect(screen.getByText('Old School')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  test('adds a school and shows a success message', async () => {
    render(<SchoolManagement />)

    fireEvent.change(screen.getByPlaceholderText('School name'), {
      target: { value: '  North School  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add School' }))

    await waitFor(() => expect(schoolState.createSchool).toHaveBeenCalledWith('North School'))
    expect(await screen.findByText('School added successfully.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('School name')).toHaveValue('')
  })

  test('does not add a school when the name is empty', () => {
    render(<SchoolManagement />)

    fireEvent.click(screen.getByRole('button', { name: 'Add School' }))

    expect(screen.getByText('School name is required.')).toBeInTheDocument()
    expect(schoolState.createSchool).not.toHaveBeenCalled()
  })

  test('renames a school and shows a success message', async () => {
    render(<SchoolManagement />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Rename' })[0])
    fireEvent.change(screen.getByDisplayValue('Alpha School'), {
      target: { value: 'Alpha College' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(schoolState.renameSchool).toHaveBeenCalledWith('school_alpha', 'Alpha College'))
    expect(await screen.findByText('School renamed successfully.')).toBeInTheDocument()
  })

  test('asks for confirmation before deactivating a school', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<SchoolManagement />)

    fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }))

    expect(confirm).toHaveBeenCalledWith('Deactivate Alpha School?')
    await waitFor(() => expect(schoolState.setSchoolActive).toHaveBeenCalledWith('school_alpha', false))
    expect(await screen.findByText('School deactivated successfully.')).toBeInTheDocument()
  })

  test('reactivates an inactive school without a deactivation prompt', async () => {
    const confirm = vi.spyOn(window, 'confirm')
    render(<SchoolManagement />)

    fireEvent.click(screen.getByRole('button', { name: 'Activate' }))

    await waitFor(() => expect(schoolState.setSchoolActive).toHaveBeenCalledWith('school_old', true))
    expect(confirm).not.toHaveBeenCalled()
    expect(await screen.findByText('School activated successfully.')).toBeInTheDocument()
  })
})
