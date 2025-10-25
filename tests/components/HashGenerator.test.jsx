import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// import tested component
import HashGenerator from '../../src/components/HashGenerator'

describe('HashGenerator component', () => {

    // test component rendering
    it('renders the component', () => {
        render(<HashGenerator/>)

        // expect component elements to be rendered
        expect(screen.getByText('Hash Generator')).toBeInTheDocument()
        expect(screen.getByText('Input:')).toBeInTheDocument()
        expect(screen.getByText('Algorithm:')).toBeInTheDocument()
        expect(screen.getByText('Generate Hash')).toBeInTheDocument()
    })

    // test MD5 hash generation
    it('generates an MD5 hash', async () => {
        render(<HashGenerator/>)

        // submit input
        const input = screen.getByLabelText('Input:')
        fireEvent.change(input, { target: { value: 'hello world' } })
        fireEvent.click(screen.getByText('Generate Hash'))
        
        // check result
        const hash = await screen.findByText('5eb63bbbe01eeed093cb22bb8f5acdc3')
        expect(hash).toBeInTheDocument()
    })

    // test SHA-256 hash generation
    it('generates a SHA-256 hash', async () => {
        render(<HashGenerator/>)
        
        // submit input
        const algorithmSelect = screen.getByLabelText('Algorithm:')
        fireEvent.change(algorithmSelect, { target: { value: 'SHA-256' } })
        const input = screen.getByLabelText('Input:')
        fireEvent.change(input, { target: { value: 'hello world' } })
        fireEvent.click(screen.getByText('Generate Hash'))
        
        // check result
        const hash = await screen.findByText('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')
        expect(hash).toBeInTheDocument()
    })

    // test algorithm switching
    it('switches algorithm', () => {
        render(<HashGenerator/>)
        
        // select algorithm
        const algorithmSelect = screen.getByLabelText('Algorithm:')
        fireEvent.change(algorithmSelect, { target: { value: 'SHA-1' } })
        
        // check if algorithm is selected
        expect(algorithmSelect.value).toBe('SHA-1')
    })
})
