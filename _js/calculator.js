function validate(arr, screen) {
  // checks formatted array for proper sequence of
  // numbers alternating with operators
  let result;
  let working_arr = formatArr(arr);
  // console.log
  if (isNaN(working_arr[0])) {
    error('First item must be a number');
  }
  if (isNaN(working_arr[working_arr.length-1])) {
    error('Last item must be a number');
  }
  // check for multiple operators next to each other
  for (let i = 0; i < working_arr.length; i++) {
    if (isNaN(working_arr[i]) && working_arr[i].length > 1) {
      error("Can't have two operators in sequence");
    }
  }
  function error(msg) {
    console.log(msg);
    error_flag = true;
    refreshScreen(['ERROR'],screen);
    return;
  }
  return working_arr;
}

function formatArr(arr) {
  // Clumps together numbers into multi-digit strings
  // and non-numbers into multi-digit strings consisting of
  // operators.
  // Resulting array still needs more validating but at least
  // it consists of alternating number strings alternating with
  // non-number strings.
  console.log('unformatted -')
  console.log(arr);
  let format_arr = [];
  let cur_num = '';
  let cur_str = '';
  for (let i = 0; i < arr.length; i++) {
    if (isNaN(arr[i])) {
      // if it's not a number -
      cur_str += arr[i];
      // on first iteration, this 'if' statement doesn't do anthing.
      // In later iterations, this detects when a clump (in this
      // case a clump of numbers) is complete and needs to be
      // pushed to results array.
      //
      if (cur_num.length > 0) {
        format_arr.push(cur_num);
        cur_num = '';
      }
    }
    else {
      // if it is a number
      cur_num += arr[i];
      if (cur_str.length > 0) {
        format_arr.push(cur_str);
        cur_str = '';
      }
    }
    // if last iteration, need to push item because in some cases
    // (right after addition or subtraction)
    // it will get left behind.
    if (i === arr.length - 1) {
      if (cur_num.length > 0)
      {format_arr.push(cur_num);}
      if (cur_str.length > 0)
      {format_arr.push(cur_str);}
    }
  }
  console.log('formatted -')
  console.log(format_arr);
  return format_arr;
}

function calculate(arr, error_flag) {
  let newArr = [];
  // while loop keeps running the for loop until all division and
  // multiplication operations are finished. The resulting array
  // is a much easier equation - just addition and subraction operators
  // in proper sequence with number strings.
  while((arr.indexOf('x') !== -1) || (arr.indexOf('÷') !== -1)) {
    let temp, op;
    // for loop goes one to n times and performs multiplication and
    // division.
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 !== 0) {
        if (arr[i] === '+' || arr[i] === '-') {
          newArr.push(arr[i-1], arr[i]);
        }
        if (arr[i] === 'x') {
          op = 'x';
          temp = operators[op](parseInt(arr[i-1]),parseInt(arr[i+1]));
          newArr.push(temp);
          if (arr[i+2]) {
            newArr.push(arr[i+2]);
            i = i + 3;
          }
        }
        if (arr[i] === '÷') {
          op = '÷';
          // check for zero values
          if (arr[i-1] === 0 || arr[i+1] === 0) {
            error("can't divide by zero");
            return;
          }
          temp = operators[op](parseFloat(arr[i-1]),parseFloat(arr[i+1]));
          newArr.push(temp);
          if (arr[i+2]) {
            newArr.push(arr[i+2]);
            i = i + 3;
          }
        }
        // final element (if any) is a number so push it to results array.
        if (i === arr.length -1) {
          newArr.push(arr[i])
        }
      }
    }
    arr = newArr;
    newArr = [];
  }
  // this for loop performs addition and subraction and returns the
  // final result to display on calculator screen.
  let running_total = arr[0];
  let op;
  for (let j = 1; j < arr.length; j = j + 2) {
    op = arr[j];
    running_total = operators[op](parseInt(running_total), parseInt(arr[j+1]));
    if (!(arr[j+2])) { break; }
  }
  return running_total;
}

function refreshScreen(arr, screen) {
  // later replace loop with arr.join
  let screen_str = '';
  for (let i = 0; i < arr.length; i++) {
    screen_str += arr[i];
  }
  screen.textContent = screen_str;
}

// object containing helper functions for calculations
let operators = {
  '+': function(a, b) { return a + b },
  '-': function(a, b) { return a - b },
  'x': function(a, b) { return a * b },
  '÷': function(a, b) { return a / b },
};

document.addEventListener('DOMContentLoaded', function () {
  let input_arr = [];
  let error_flag = false;
  let buttons_container = document.querySelector('#buttons-container');
  let screen = document.querySelector('#screen');

  buttons_container.addEventListener('click', function(event) {
    let cur_unit = event.target;
    let final_result;
    if (cur_unit.textContent === 'C') {
      error_flag = false;
      input_arr.length = 0;
      refreshScreen(['enter equation'], screen);
      return;
    }
    else if (cur_unit.textContent === '=' && !error_flag) {
      final_result = calculate(validate(input_arr, screen), error_flag);
      input_arr = [];
      if (!error_flag) {
        refreshScreen([final_result], screen);
      }
      return;
    }
    else if (!error_flag) {
      input_arr.push(cur_unit.textContent);
      refreshScreen(input_arr, screen);
      return;
    }
  });
});
