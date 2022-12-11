import spinner from '@/src/assets/spinner.svg';

const Spinner = ({width, height}: any) => {

    return (
            <div>
                <img width={width} height={height} src={spinner.src}></img>
            </div>
    );
}

export default Spinner;
