import './LoadingScreen.scss';

function LoadingScreen(): JSX.Element {
	return (
		<div className={'loading-div'}>
			<i
				data-testid={'loading-spinner'}
				className="fa-10x fa-solid fa-spinner fa-spin loading-spinner"
			></i>
			<h2>Loading...</h2>
		</div>
	);
}

export default LoadingScreen;
