import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// import the component to be tested
import ParticlesBackground from '../../src/others/ParticlesBackground'

// mock the particles libraries
vi.mock('@tsparticles/react', () => ({
    default: (props) => <div data-testid="particles-container" id={props.id}></div>,
    initParticlesEngine: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@tsparticles/slim', () => ({
    loadSlim: vi.fn().mockResolvedValue(undefined)
}))

describe('ParticlesBackground component', () => {
    // test component rendering
    it('renders the particles container', async () => {
        render(<ParticlesBackground/>)

        // check particles container is rendered
        const particlesContainer = await screen.findByTestId('particles-container')
        expect(particlesContainer).toBeInTheDocument()
    })
})
