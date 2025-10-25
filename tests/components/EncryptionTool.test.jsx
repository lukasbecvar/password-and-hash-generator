import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// import tested component
import EncryptionTool from '../../src/components/EncryptionTool'

// mock crypto-js library
vi.mock('crypto-js', () => ({
    default: {
        AES: {
            encrypt: vi.fn(() => 'mocked_encrypted_string'),
            decrypt: vi.fn(() => 'mocked_decrypted_string')
        },
        enc: {
            Utf8: {
                parse: vi.fn((val) => val)
            }
        },
        mode: {
            CBC: {},
            CFB: {},
            OFB: {},
            CTR: {},
            ECB: {}
        },
        pad: {
            Pkcs7: {},
            AnsiX923: {},
            Iso10126: {},
            ZeroPadding: {},
            NoPadding: {}
        }
    }
}))

describe('EncryptionTool component', () => {
    // test component rendering
    it('renders the component', () => {
        render(<EncryptionTool/>)

        // expect component elements to be rendered
        expect(screen.getByText('AES Encryption Tool')).toBeInTheDocument()
        expect(screen.getByText('Input:')).toBeInTheDocument()
        expect(screen.getByText('Key (exactly 32 chars):')).toBeInTheDocument()
        expect(screen.getByText('IV (exactly 16 chars):')).toBeInTheDocument()
    })

    // test encryption
    it('encrypts text correctly', async () => {
        render(<EncryptionTool/>)

        // submit input
        const input = screen.getByLabelText('Input:')
        const key = screen.getByLabelText('Key (exactly 32 chars):')
        fireEvent.change(input, { target: { value: 'hello world' } })
        fireEvent.change(key, { target: { value: '12345678901234567890123456789012' } })
        fireEvent.change(screen.getByLabelText('IV (exactly 16 chars):'), { target: { value: '1234567890123456' } })
        fireEvent.click(screen.getAllByText('Encrypt')[1])
        
        // check result
        const output = await screen.findByText(/mocked_encrypted_string/)
        expect(output.textContent).toBe('mocked_encrypted_string')
    });

    // test decryption
    it('decrypts text correctly', async () => {
        render(<EncryptionTool/>)

        // submit input
        fireEvent.click(screen.getByText('Decrypt'))
        const input = screen.getByLabelText('Input:')
        const key = screen.getByLabelText('Key (exactly 32 chars):')
        fireEvent.change(input, { target: { value: 'U2FsdGVkX19qA/y6J8V/5wJ6Z5X6wXyJwG+J6H5J6H4=' } })
        fireEvent.change(key, { target: { value: '12345678901234567890123456789012' } })
        fireEvent.change(screen.getByLabelText('IV (exactly 16 chars):'), { target: { value: '1234567890123456' } })
        fireEvent.click(screen.getAllByText('Decrypt')[1])

        // check result
        const output = await screen.findByText(/mocked_decrypted_string/)
        expect(output.textContent).toBe('mocked_decrypted_string')
    })

    // test missing key
    it('shows an error for missing key', () => {
        render(<EncryptionTool/>)

        // submit input
        fireEvent.click(screen.getAllByText('Encrypt')[1])
        const error = screen.getByText('Encryption key is required.')
        
        // expect error to be rendered
        expect(error).toBeInTheDocument()
    })
})
