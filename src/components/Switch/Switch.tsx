import { useState, useEffect } from 'react';

const Switch = (props: any) => {
    const [toggle , setToggle ] = useState(false);
    const toggleClass = 'transform translate-x-6';
    const toggleBgClass = 'bg-green-500';

    const _handleClick = () => {
        props.action();
        setToggle(!toggle);
    }

    useEffect(() => {
        setToggle(props.toggled)
    }, [props.toggled])

    return (
        //   Switch Container
        <div
            className={"md:w-14 md:h-8 w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer "  +  (toggle ? null : toggleBgClass)}
            onClick={() => {
                _handleClick();
            }}
        >
            {/* Switch */}
            <div
                className = {"transition duration-250 ease-out bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform " +  (toggle ? null : toggleClass)}
            ></div>

            {!toggle && (
                <span className="text-xs -translate-x-5"> {props.offValue}</span>
            )}
            {toggle  && (
                <span className='text-xs translate-x-2'>{props.onValue}</span>
            )}

        </div>
    );
}

export default Switch;