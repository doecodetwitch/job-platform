import styles from './Button.module.css';

type propsTypes = {
    priority?: 'lower' | 'high' | 'mid' | 'low',
    size?: any,
    fill?: any,
    onClick?: any,
    children?: any
}
const Button = ({ priority, size, fill, onClick, children }: propsTypes) => {

    const buttonClasses = [];
    const wrapperClasses = [styles.divButton];

    if(priority === "lower"){
        buttonClasses.push(styles.lowerPriorityButton)
    }
    else if(priority === "low"){
        buttonClasses.push(styles.lowPriorityButton)
    }
    else if (priority === "mid"){
        buttonClasses.push(styles.midPriorityButton)
    }
    else{
        buttonClasses.push(styles.highPriorityButton)
    }

    switch (size) {
        case "small":
            buttonClasses.push(styles.buttonSmall)
            break;
        case "medium":
            buttonClasses.push(styles.buttonMedium)
            break;
        case "large":
            buttonClasses.push(styles.buttonLarge)
            break;
        case "xl":
            buttonClasses.push(styles.buttonXl)
            break;
        default:
            buttonClasses.push(styles.buttonMedium)
            break;
    }

    if (fill) {
        wrapperClasses.push(styles.buttonFill)
        buttonClasses.push(styles.buttonFill)
    }

    return (
            <div className={wrapperClasses.join(" ")}>
                <button
                    onClick={onClick}
                    className={buttonClasses.join(" ")}
                    >
                    {children}
                </button>
            </div>
    );
}

export default Button;
