const msToDuration = (duration?: number): string => {
    if (!duration) {
        return "0";
    }

    let seconds = Math.floor((duration / 1000) % 60) as string|number;
    let minutes = Math.floor((duration / (1000 * 60)) % 60) as string|number;
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24) as string|number;

    hours = (Number(hours) < 10) ? "0" + hours : hours.toString();
    minutes = (Number(minutes) < 10) ? "0" + minutes : minutes.toString();
    seconds = (Number(seconds) < 10) ? "0" + seconds : seconds.toString();

    return hours + ":" + minutes + ":" + seconds;
}

export { msToDuration };
