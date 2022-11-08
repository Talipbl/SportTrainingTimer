
let restTimeLabel = document.querySelector('#rest-time');
let totalTimeLabel = document.querySelector('#total-time');
let lapTimeLabel = document.querySelector('#lap-time');
let restList = document.querySelector('#rest-list');
let lapList = document.querySelector('#lap-list');

let totalTimer = {
    hour: 0,
    minute: 0,
    second: 0,
    milisecond: 0,
    status: false,
};
let lapTime, restTime;
let timer, restTimer, lapTimer;
let totalRest = {
    minute: 0,
    second: 0,
    count: 0,
};
let totalLap = {
    minute: 0,
    second: 0,
    count: 0,
};

function baseTimer() {
    this.minute = 0;
    this.second = 0;
    this.status = false;
};
window.onload = function () {
    lapTime = new baseTimer();
    restTime = new baseTimer();
    noSleep();
}

function setTotal() {
    totalTimeLabel.innerHTML = (totalTimer.hour < 10 ? "0" + totalTimer.hour : totalTimer.hour) + ":" + (totalTimer.minute < 10 ? "0" + totalTimer.minute : totalTimer.minute) + ":" + (totalTimer.second < 10 ? "0" + totalTimer.second : totalTimer.second) + ":" + (totalTimer.milisecond < 10 ? "0" + totalTimer.milisecond : totalTimer.milisecond);
}
function setRest() {
    restTimeLabel.innerHTML = (restTime.minute < 10 ? "0" + restTime.minute : restTime.minute) + ":" + (restTime.second < 10 ? "0" + restTime.second : restTime.second);
}
function setLap() {
    lapTimeLabel.innerHTML = (lapTime.minute < 10 ? "0" + lapTime.minute : lapTime.minute) + ":" + (lapTime.second < 10 ? "0" + lapTime.second : lapTime.second);
}
function pushLap() {
    if (!lapTime.status) {
        lapTime.status = true;
        lapTimer = setInterval(function () {
            lapTime.second++
            if (lapTime.second == 60) {
                lapTime.minute++;
                lapTime.second = 0;
                if (lapTime.minute == 60) {
                    lapTime.minute = 0;
                }
            }
            setLap();
        }, 1000);
    }
    else {
        lapTime.status = false;
        clearInterval(lapTimer);
    }
}
async function noSleep(){
    
    var promise = document.querySelector('video').play();

    if (promise !== undefined) {
    promise.then(_ => {
        console.log('Always on')
    }).catch(error => {
        console.log(error);
    });
    }
}

async function done() {
    await Swal.fire({
        title: '<strong>End Of Training</strong>',
        icon: 'info',
        html:
            '<b>Total time: </b> ' + (totalTimer.hour < 10 ? "0" + totalTimer.hour : totalTimer.hour) + ":" + (totalTimer.minute < 10 ? "0" + totalTimer.minute : totalTimer.minute) + ":" + (totalTimer.second < 10 ? "0" + totalTimer.second : totalTimer.second) + ":" + (totalTimer.milisecond < 10 ? "0" + totalTimer.milisecond : totalTimer.milisecond) + '<br>' +
            '<b>Total lap: </b>' + totalLap.count + ' / ' + (totalLap.minute < 10 ? "0" + totalLap.minute : totalLap.minute) + ":" + (totalLap.second < 10 ? "0" + totalLap.second : totalLap.second) + '<br>' +
            '<b>Total rest: </b> ' + (totalRest.minute < 10 ? "0" + totalRest.minute : totalRest.minute) + ":" + (totalRest.second < 10 ? "0" + totalRest.second : totalRest.second) + '<br>',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!'
    })
    window.location.reload();
}

document.querySelector('#btn-rest').addEventListener('click', function () {
    if (!restTime.status) {
        totalRest.count++;
        pushLap();
        document.getElementById("btn-lap").click();
        document.querySelector('#btn-rest').innerHTML = "Stop Rest";
        restTime.status = true;
        restTimer = setInterval(function () {
            restTime.second++;
            if (restTime.second == 60) {
                restTime.second = 0;
                restTime.minute++;
                if (restTime.minute == 60) {
                    restTime.minute = 0;
                }
            }
            setRest();
        }, 1000);
    }
    else {
        let value = '<li class="list-group-item bg-transparent text-white border-0">' + totalRest.count + '. ' + (restTime.minute < 10 ? '0' + restTime.minute : restTime.minute) + ':' + (restTime.second < 10 ? '0' + restTime.second : restTime.second) + '</li>';
        restList.innerHTML = value + restList.innerHTML;
        totalRest.minute += restTime.minute;
        let total = totalRest.second + restTime.second;
        if (total > 60) {
            totalRest.minute++;
            totalRest.second += 60 - restTime.second;
        }
        else {
            totalRest.second = restTime.second;
        }
        pushLap();
        document.getElementById("btn-lap").click();
        restTime.status = false;
        restTime.second = 0;
        restTime.minute = 0;
        setRest();
        document.querySelector('#btn-rest').innerHTML = "Start Rest";
        clearInterval(restTimer);
    }
});
document.querySelector('#btn-total').addEventListener('click', function () {
    if (!totalTimer.status) {
        document.querySelector('#btn-reset').classList.remove('disabled');
        document.querySelector('#btn-rest').classList.remove('disabled');
        document.querySelector('#btn-lap').classList.remove('disabled');
        document.querySelector('#btn-total').innerHTML = "Pause";
        pushLap();
        totalTimer.status = true;
        timer = setInterval(function () {
            totalTimer.milisecond += 10;
            if (totalTimer.milisecond == 100) {
                totalTimer.milisecond = 0;
                totalTimer.second++;
                if (totalTimer.second == 60) {
                    totalTimer.second = 0;
                    totalTimer.minute++;
                    if (totalTimer.minute == 60) {
                        totalTimer.minute = 0;
                        totalTimer.hour++;
                    }
                }
            }
            setTotal();
        }, 100);
    }
    else {
        document.querySelector('#btn-total').innerHTML = "Start";
        document.querySelector('#btn-rest').classList.add('disabled');
        document.querySelector('#btn-lap').classList.add('disabled');
        totalTimer.status = false;
        clearInterval(timer);
        pushLap();
    }
});
document.querySelector('#btn-lap').addEventListener('click', function () {
    if (lapTime.minute != 0 || lapTime.second != 0 && lapTime.status != false) {
        totalLap.count++;
        let value = '<li class="list-group-item bg-transparent text-white border-0">' + totalLap.count + '. ' + (lapTime.minute < 10 ? '0' + lapTime.minute : lapTime.minute) + ':' + (lapTime.second < 10 ? '0' + lapTime.second : lapTime.second) + '</li>';
        lapList.innerHTML = value + lapList.innerHTML;
        totalLap.minute += lapTime.minute;
        let total = totalLap.second + lapTime.second;
        if (total > 60) {
            totalLap.minute++;
            totalLap.second += 60 - lapTime.second;
        }
        else {
            totalLap.second = lapTime.second;
        }
        lapTime.minute = 0;
        lapTime.second = 0;
    }
});
document.querySelector('#btn-reset').addEventListener('click', function () {
    done();
});