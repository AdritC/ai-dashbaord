const run = function (low, high) {
  let final_arr = []

  for (let i = low; i <= high; i++) {
    let final = ``;
    var string = i.toString()
    var arr = []
    for (let j = 0; j < string.length; j++) {
      arr.push(string[j])
    }

    for (let j = 0; j < arr.length; j++) {
      if (Number(arr[j]) + 1 == Number(arr[j + 1]) && j != arr.length - 1) {
        arr[j] = {
          number: arr[j],
          condition: true
        }
      } else if (j == arr.length - 1) {
        arr[j] = {
          number: arr[j],
          condition: true
        }
      }
    }
    let bool = true;

    for (const element of arr) {
      if (element.condition !== arr[0].condition) {
        bool == false
      }
    }

    if (bool) {
      for (let j = 0; j < arr.length; j++) {
        final += arr[j].number
      }
      final_arr.push(Number(final))
    }
  }

  final_arr.

  console.log(final_arr)
};

run(10, 100)