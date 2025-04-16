function binaryToDecimal(bin) {
    if (bin[0] === '1') {
      // Two's complement negative
      let inverted = bin.split('').map(b => (b === '0' ? '1' : '0')).join('');
      return -(parseInt(inverted, 2) + 1);
    }
    return parseInt(bin, 2);
  }
  
  function decimalToBinary(num, bits) {
    if (num >= 0) {
      return num.toString(2).padStart(bits, '0');
    } else {
      return (Math.pow(2, bits) + num).toString(2).slice(-bits);
    }
  }
  
  function runBoothsAlgorithm() {
    const bitSize = parseInt(document.getElementById("bit-size").value);
    const M_bin = document.getElementById("multiplicand").value;
    const Q_bin = document.getElementById("multiplier").value;
  
    if (M_bin.length !== bitSize || Q_bin.length !== bitSize) {
      alert(`Please enter ${bitSize}-bit binary numbers.`);
      return;
    }
  
    const M = binaryToDecimal(M_bin);
    let A = 0;
    let Q = binaryToDecimal(Q_bin);
    let Q_1 = 0;
    let SC = bitSize;
  
    const output = document.getElementById("output-body");
    const final = document.getElementById("final-result");
    output.innerHTML = "";
    final.innerText = "";
  
    function addRow(step, A, Q, Q_1, SC, op) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${step}</td>
        <td>${decimalToBinary(A, bitSize)}</td>
        <td>${decimalToBinary(Q, bitSize)}</td>
        <td>${Q_1}</td>
        <td>${SC}</td>
        <td>${op}</td>
      `;
      output.appendChild(row);
    }
  
    addRow("Init", A, Q, Q_1, SC, "Initialization");
  
    let step = 1;
  
    function stepAlgo() {
      if (SC === 0) {
        const result = ((A << bitSize) | (Q & ((1 << bitSize) - 1)));
        final.innerText = `Final Result (Binary): ${decimalToBinary(result, bitSize * 2)}\nDecimal: ${result >= Math.pow(2, bitSize * 2 - 1) ? result - Math.pow(2, bitSize * 2) : result}`;
        return;
      }
  
      const Qn = Q & 1;
      const operationBits = `${Qn}${Q_1}`;
      let operation = '';
  
      if (operationBits === '01') {
        A += M;
        operation = 'A = A + M';
      } else if (operationBits === '10') {
        A -= M;
        operation = 'A = A - M';
      } else {
        operation = 'No Operation';
      }
  
      addRow(step++, A, Q, Q_1, SC, operation);
  
      // Arithmetic shift right
      const combined = (A << (bitSize + 1)) | (Q << 1) | Q_1;
      const shifted = combined >> 1;
  
      A = shifted >> (bitSize + 1);
      Q = (shifted >> 1) & ((1 << bitSize) - 1);
      Q_1 = shifted & 1;
  
      SC--;
  
      addRow(step++, A, Q, Q_1, SC, 'ASR');
  
      setTimeout(stepAlgo, 1000);
    }
  
    setTimeout(stepAlgo, 1000);
  }
  