import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// import tested component
import Base64EncoderDecoder from '../../src/components/Base64EncoderDecoder'

describe('Base64EncoderDecoder component', () => {
    // test component rendering
    it('renders the component and selectors', () => {
        render(<Base64EncoderDecoder/>)

        // expect text and image selectors to be rendered
        expect(screen.getByText('Text')).toBeInTheDocument()
        expect(screen.getByText('Image')).toBeInTheDocument()
        
        // expect buttons to be rendered
        const encodeButtons = screen.getAllByText('Encode')
        const decodeButtons = screen.getAllByText('Decode')
        expect(encodeButtons.length).toBe(2)
        expect(decodeButtons.length).toBe(1)
    })

    // test switching between modes and actions
    it('switches between modes and actions', () => {
        render(<Base64EncoderDecoder/>)

        // image encode mode
        fireEvent.click(screen.getByText('Image'))
        expect(screen.getByText('Upload Image to encode:')).toBeInTheDocument()

        // image decode mode
        fireEvent.click(screen.getByText('Decode'))
        expect(screen.getByText('Paste Image Base64 to decode:')).toBeInTheDocument()
    })

    // test text encoding
    it('encodes text correctly', () => {
        render(<Base64EncoderDecoder/>)
        
        // submit text
        fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'hello world' } })
        fireEvent.click(screen.getAllByText('Encode')[1])
        
        // check result
        const result = screen.getByDisplayValue('aGVsbG8gd29ybGQ=')
        expect(result).toBeInTheDocument()
    })

    // test text decoding
    it('decodes text correctly', () => {
        render(<Base64EncoderDecoder/>)
        
        // submit text
        fireEvent.click(screen.getByText('Decode'))
        fireEvent.change(screen.getByPlaceholderText('Paste Base64'), { target: { value: 'aGVsbG8gd29ybGQ=' } })
        fireEvent.click(screen.getAllByText('Decode')[1])
        
        // check result
        const result = screen.getByDisplayValue('hello world')
        expect(result).toBeInTheDocument()
    })

    // test invalid base64 decoding
    it('shows an error for invalid base64 decoding', () => {
        render(<Base64EncoderDecoder/>)

        // submit invalid base64
        fireEvent.click(screen.getByText('Decode'))
        fireEvent.change(screen.getByPlaceholderText('Paste Base64'), { target: { value: 'invalid base64' } })
        fireEvent.click(screen.getAllByText('Decode')[1])
        
        // check result
        const result = screen.getByDisplayValue('Invalid base64')
        expect(result).toBeInTheDocument()
    })
})
