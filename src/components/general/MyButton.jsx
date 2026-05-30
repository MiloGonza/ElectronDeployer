function MyButton({ icon, label, textColor, bg }) {
    return (
        <button className={`px-4 py-2 gap-2 flex items-center rounded-xl text-nowrap ${bg} transition-colors duration-300 hover:cursor-pointer`}>
            {icon && icon}
            {label && <span className={`${textColor}`}>{label}</span>}
        </button>
    )
}

export default MyButton; 