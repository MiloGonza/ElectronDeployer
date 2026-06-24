function MyButton({ icon, label, textColor, bg, children, padding = "px-4 py-2", className = "", ...props }) {
    return (
        <button {...props} className={`${className} ${padding} gap-2 flex items-center rounded-xl text-nowrap ${bg} transition-all duration-300 hover:cursor-pointer`}>
            {icon && icon}
            {label && <span className={`${textColor}`}>{label}</span>}
            {children && children}
        </button>
    )
}

export default MyButton; 