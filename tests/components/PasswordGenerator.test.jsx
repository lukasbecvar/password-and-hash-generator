import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// import tested component
import PasswordGenerator from '../../src/components/PasswordGenerator'

describe('PasswordGenerator component', () => {
    // mock clipboard
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: vi.fn()
        }
    })

    // test component rendering
    it('renders the component', () => {
        render(<PasswordGenerator/>)

        // expect component elements to be rendered
        expect(screen.getByText('Password Generator')).toBeInTheDocument()
        expect(screen.getByText('Length: 25')).toBeInTheDocument()
        expect(screen.getByText('Uppercase (A–Z)')).toBeInTheDocument()
        expect(screen.getByText('Lowercase (a–z)')).toBeInTheDocument()
        expect(screen.getByText('Numbers (0–9)')).toBeInTheDocument()
        expect(screen.getByText('Symbols (!@#$...)')).toBeInTheDocument()
        expect(screen.getByText('Generate Password')).toBeInTheDocument()
    })

    // test password generation
    it('generates a password', () => {
        render(<PasswordGenerator/>)

        // submit input
        fireEvent.click(screen.getByText('Generate Password'))
        const password = screen.getByText(/.{25}/)

        // check result
        expect(password).toBeInTheDocument()
    })

    // test password length changing
    it('changes password length', () => {
        render(<PasswordGenerator/>)

        // submit input
        const slider = screen.getByLabelText('Length: 25')
        fireEvent.change(slider, { target: { value: '10' } })
        const lengthLabel = screen.getByText('Length: 10')
        
        // check result
        expect(lengthLabel).toBeInTheDocument()
    })

    // test password generation with no options selected
    it('shows an error when no options are selected', () => {
        render(<PasswordGenerator/>)

        // submit input
        fireEvent.click(screen.getByLabelText('Uppercase (A–Z)'))
        fireEvent.click(screen.getByLabelText('Lowercase (a–z)'))
        fireEvent.click(screen.getByLabelText('Numbers (0–9)'))
        fireEvent.click(screen.getByText('Generate Password'))
        
        // check result
        const error = screen.getByText('Select at least one option!')
        expect(error).toBeInTheDocument()
    })

    // test copy to clipboard
    it('copies the password to clipboard', async () => {
        render(<PasswordGenerator/>)

        // submit input
        fireEvent.click(screen.getByText('Generate Password'))
        const password = screen.getByText(/.{25}/).textContent
        fireEvent.click(screen.getByText('Copy'))
        
        // check result
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(password)
    })

    // test password generation (only lowercases)
    it('generates a password with only lowercase letters', () => {
        render(<PasswordGenerator/>)

        // submit input
        fireEvent.click(screen.getByLabelText('Uppercase (A–Z)'))
        fireEvent.click(screen.getByLabelText('Numbers (0–9)'))
        fireEvent.click(screen.getByText('Generate Password'))
        
        // check result
        const password = screen.getByText(/.{25}/).textContent
        expect(password).toMatch(/^[a-z]+$/)
    })

    // test password generation (only uppercases)
    it('generates a password with only uppercase letters', () => {
        render(<PasswordGenerator/>)

        // submit input
        fireEvent.click(screen.getByLabelText('Lowercase (a–z)'))
        fireEvent.click(screen.getByLabelText('Numbers (0–9)'))
        fireEvent.click(screen.getByText('Generate Password'))
        
        // check result
        const password = screen.getByText(/.{25}/).textContent
        expect(password).toMatch(/^[A-Z]+$/)
    })

    // test password generation (only numbers)
    it('generates a password with only numbers', () => {
        render(<PasswordGenerator/>)

        // submit input
        fireEvent.click(screen.getByLabelText('Uppercase (A–Z)'))
        fireEvent.click(screen.getByLabelText('Lowercase (a–z)'))
        fireEvent.click(screen.getByText('Generate Password'))
        
        // check result
        const password = screen.getByText(/.{25}/).textContent
        expect(password).toMatch(/^[0-9]+$/)
    })

    // test password generation (only symbols)
    it('generates a password with only symbols', () => {
        render(<PasswordGenerator/>)

        // submit input
        fireEvent.click(screen.getByLabelText('Uppercase (A–Z)'))
        fireEvent.click(screen.getByLabelText('Lowercase (a–z)'))
        fireEvent.click(screen.getByLabelText('Numbers (0–9)'))
        fireEvent.click(screen.getByLabelText('Symbols (!@#$...)'))
        fireEvent.click(screen.getByText('Generate Password'))
        
        // check result
        const password = screen.getByText(/.{25}/).textContent
        expect(password).toMatch(/^[!@#$%^&*()_+[\]{}|;:,.<>?]+$/)
    })
})
