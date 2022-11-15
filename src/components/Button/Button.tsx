import styles from './Button.module.css';

const Button = (props: any) => {

    const buttonClasses = [];
    const wrapperClasses = [styles.divButton];

    if(props.priority === "lower"){
        buttonClasses.push(styles.lowerPriorityButton)
    }
    else if(props.priority === "low"){
        buttonClasses.push(styles.lowPriorityButton)
    }
    else if (props.priority === "mid"){
        buttonClasses.push(styles.midPriorityButton)
    }
    else{
        buttonClasses.push(styles.highPriorityButton)
    }

    switch (props.size) {
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

    if (props.fill) {
        wrapperClasses.push(styles.buttonFill)
        buttonClasses.push(styles.buttonFill)
    }

    return (
            <div className={wrapperClasses.join(" ")}>
                <button
                    onClick={props.onClick}
                    className={buttonClasses.join(" ")}
                    >
                    {props.children}
                </button>
            </div>
    );
}

export default Button;
