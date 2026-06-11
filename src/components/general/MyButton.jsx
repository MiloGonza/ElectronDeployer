function MyButton({ icon, label, textColor, bg, padding = "px-4 py-2", className = "", ...props }) {
    return (
        <button {...props} className={`${className} ${padding} gap-2 flex items-center rounded-xl text-nowrap ${bg} transition-colors duration-300 hover:cursor-pointer`}>
            {icon && icon}
            {label && <span className={`${textColor}`}>{label}</span>}
        </button>
    )
}

export default MyButton; 