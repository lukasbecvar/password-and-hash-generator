import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'

// import tested component
import App from '../src/App'

// mock child components
vi.mock('../src/components/PasswordGenerator', () => ({
    default: () => <div data-testid="password-generator">Password Generator</div>
}))
vi.mock('../src/components/HashGenerator', () => ({
    default: () => <div data-testid="hash-generator">Hash Generator</div>
}))
vi.mock('../src/components/EncryptionTool', () => ({
    default: () => <div data-testid="encryption-tool">Encryption Tool</div>
}))
vi.mock('../src/components/Base64EncoderDecoder', () => ({
    default: () => <div data-testid="base64-encoder-decoder">Base64 Encoder/Decoder</div>
}))
vi.mock('../src/others/ParticlesBackground', () => ({
    default: () => <div data-testid="particles-background">Particles Background</div>
}))

// mock useLocation to track route changes
const MockLocationDisplay = () => {
    const location = useLocation()
    return <div data-testid="location-display">{location.pathname}</div>
}

describe('App component', () => {
    beforeEach(() => {
        // mock window.matchMedia for mobile view tests
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: query.includes('max-width: 767px'), // simulate mobile screen
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            }))
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    const renderWithRouter = (initialEntries = ['/']) => {
        return render(
            <MemoryRouter initialEntries={initialEntries}>
                <App/>
                <MockLocationDisplay/>
            </MemoryRouter>
        )
    }

    // test navigation and default PasswordGenerator on initial load
    it('renders navigation and default PasswordGenerator on initial load', () => {
        renderWithRouter()

        // expect navigation links
        expect(screen.getByText('Password generator')).toBeInTheDocument()
        expect(screen.getByText('Hash generator')).toBeInTheDocument()
        expect(screen.getByText('Encryption tool')).toBeInTheDocument()
        expect(screen.getByText('Base64')).toBeInTheDocument()

        // expect the PasswordGenerator is rendered by default
        expect(screen.getByTestId('password-generator')).toBeInTheDocument()
        expect(screen.queryByTestId('hash-generator')).not.toBeInTheDocument()

        // verify the initial route is correct
        expect(screen.getByTestId('location-display')).toHaveTextContent('/')
    })

    // test navigation to HashGenerator when the link is clicked
    it('navigates to HashGenerator when the link is clicked', () => {
        renderWithRouter()

        const hashLinks = screen.getAllByText('Hash generator')
        fireEvent.click(hashLinks[0])

        // check HashGenerator is now rendered
        expect(screen.getByTestId('hash-generator')).toBeInTheDocument()
        expect(screen.queryByTestId('password-generator')).not.toBeInTheDocument()

        // verify the route has changed
        expect(screen.getByTestId('location-display')).toHaveTextContent('/hash')
    })

    // test navigation to EncryptionTool when the link is clicked
    it('navigates to EncryptionTool when the link is clicked', () => {
        renderWithRouter()

        const encryptionLinks = screen.getAllByText('Encryption tool')
        fireEvent.click(encryptionLinks[0])

        // check EncryptionTool is now rendered
        expect(screen.getByTestId('encryption-tool')).toBeInTheDocument()
        expect(screen.queryByTestId('password-generator')).not.toBeInTheDocument()

        // verify the route has changed
        expect(screen.getByTestId('location-display')).toHaveTextContent('/encryption')
    })

    // test navigation to Base64EncoderDecoder when the link is clicked
    it('navigates to Base64EncoderDecoder when the link is clicked', () => {
        renderWithRouter()

        const base64Links = screen.getAllByText('Base64')
        fireEvent.click(base64Links[0])

        // check Base64EncoderDecoder is now rendered
        expect(screen.getByTestId('base64-encoder-decoder')).toBeInTheDocument()
        expect(screen.queryByTestId('password-generator')).not.toBeInTheDocument()

        // verify the route has changed
        expect(screen.getByTestId('location-display')).toHaveTextContent('/base64')
    })

    // test mobile menu toggle and navigation
    it('toggles mobile menu and navigates correctly', async () => {
        renderWithRouter()

        const menuButton = screen.getByRole('button', { name: /menu/i })

        // open mobile menu
        fireEvent.click(menuButton)

        // find mobile menu container
        const mobileMenu = await screen.findByTestId('mobile-menu')
        expect(mobileMenu).toBeInTheDocument()

        // find link within the mobile menu
        const mobileHashLink = within(mobileMenu).getByText('Hash generator')
        fireEvent.click(mobileHashLink)

        // check HashGenerator is rendered
        expect(screen.getByTestId('hash-generator')).toBeInTheDocument()

        // verify the route has changed
        expect(screen.getByTestId('location-display')).toHaveTextContent('/hash')
    })

    // test PasswordGenerator for a non-matching route
    it('renders PasswordGenerator for a non-matching route', () => {
        renderWithRouter(['/some/random/route'])

        // check PasswordGenerator is rendered as the fallback
        expect(screen.getByTestId('password-generator')).toBeInTheDocument()
        expect(screen.queryByTestId('hash-generator')).not.toBeInTheDocument()

        // location display will show the random route
        expect(screen.getByTestId('location-display')).toHaveTextContent('/some/random/route')
    })
})
