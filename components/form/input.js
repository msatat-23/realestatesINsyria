



export const Input = ({ name, type, placeholder, onChange, value, onBlur, error, state, dispatch }) => {



    return (
        <div className="flex flex-col mb-4 relative">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder:text-right ${error ? 'border-red-300' : 'border-gray-200'
                    }`}
                dir="ltr"
                    
            />
            {(name === 'password') && <img className="absolute left-2 top-1.5 p-1 w-9 h-9"
                src={`${state.showpassword ? '/assets/icons/showandhidepass/hide.png' : '/assets/icons/showandhidepass/eye (1).png'}`}
                onClick={() => { dispatch({ type: 'SHOWPASSWORD' }) }} />}
            {(name === 'passwordconfirmation') && <img className="absolute left-2 top-1.5 p-1 w-9 h-9"
                src={`${state.showpassword ? '/assets/icons/showandhidepass/hide.png' : '/assets/icons/showandhidepass/eye (1).png'}`}
                onClick={() => { dispatch({ type: 'SHOWPASSWORD' }) }} />}
            {(error && name !== "lastname") && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
