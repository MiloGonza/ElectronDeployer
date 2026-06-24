function PlusIcon({ fill, stroke, size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}em`}
            height={`${size}em`}
            viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
                fill={fill}
                stroke={stroke}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h7m7 0h-7m0 0V5m0 7v7" />
        </svg>

    )
}

export default PlusIcon;