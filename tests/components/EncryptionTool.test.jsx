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
    })

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

    // test missing input
    it('shows an error for missing input', () => {
        render(<EncryptionTool/>)

        // submit input
        const key = screen.getByLabelText('Key (exactly 32 chars):')
        fireEvent.change(key, { target: { value: '12345678901234567890123456789012' } })
        fireEvent.click(screen.getAllByText('Encrypt')[1])
        const error = screen.getByText('Input is required.')
        
        // expect error to be rendered
        expect(error).toBeInTheDocument()
    })

    // test missing IV
    it('shows an error for missing IV', () => {
        render(<EncryptionTool/>)

        // submit input
        const input = screen.getByLabelText('Input:')
        const key = screen.getByLabelText('Key (exactly 32 chars):')
        fireEvent.change(input, { target: { value: 'hello world' } })
        fireEvent.change(key, { target: { value: '12345678901234567890123456789012' } })
        fireEvent.click(screen.getAllByText('Encrypt')[1])
        const error = screen.getByText('IV is required for selected mode.')
        
        // expect error to be rendered
        expect(error).toBeInTheDocument()
    })

    // test invalid key length
    it('shows an error for invalid key length', () => {
        render(<EncryptionTool/>)

        // submit input
        const input = screen.getByLabelText('Input:')
        const key = screen.getByLabelText('Key (exactly 32 chars):')
        fireEvent.change(input, { target: { value: 'hello world' } })
        fireEvent.change(key, { target: { value: '123' } })
        fireEvent.click(screen.getAllByText('Encrypt')[1])
        const error = screen.getByText('Key must be exactly 32 characters long for 256-bit AES.')
        
        // expect error to be rendered
        expect(error).toBeInTheDocument()
    })

    // test invalid IV length
    it('shows an error for invalid IV length', () => {
        render(<EncryptionTool/>)

        // submit input
        const input = screen.getByLabelText('Input:')
        const key = screen.getByLabelText('Key (exactly 32 chars):')
        fireEvent.change(input, { target: { value: 'hello world' } })
        fireEvent.change(key, { target: { value: '12345678901234567890123456789012' } })
        fireEvent.change(screen.getByLabelText('IV (exactly 16 chars):'), { target: { value: '123' } })
        fireEvent.click(screen.getAllByText('Encrypt')[1])
        const error = screen.getByText('IV must be exactly 16 characters long.')
        
        // expect error to be rendered
        expect(error).toBeInTheDocument()
    })

    // test no IV in ECB mode
    it('does not show IV input in ECB mode', () => {
        render(<EncryptionTool/>)

        // change mode to ECB
        const modeSelect = screen.getByLabelText('Mode:')
        fireEvent.change(modeSelect, { target: { value: 'ECB' } })

        // expect IV input to not be rendered
        const ivInput = screen.queryByLabelText('IV (exactly 16 chars):')
        expect(ivInput).not.toBeInTheDocument()
    })

    // test copy to clipboard
    it('copies output to clipboard', async () => {
        // mock clipboard
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn(),
            },
        })

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

        // copy to clipboard
        const copyButton = screen.getByText('Copy')
        fireEvent.click(copyButton)

        // expect clipboard to be called
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('mocked_encrypted_string')
        expect(await screen.findByText('Copied!')).toBeInTheDocument()
    })

    // test bit length change
    it('updates required key length on bit length change', () => {
        render(<EncryptionTool/>)

        // change bit length
        const bitLengthSelect = screen.getByLabelText('Bit length:')
        fireEvent.change(bitLengthSelect, { target: { value: '128' } })

        // expect key label to be updated
        expect(screen.getByText('Key (exactly 16 chars):')).toBeInTheDocument()
    })
})
