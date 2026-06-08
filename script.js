// ========== УПРАВЛЕНИЕ СВОРАЧИВАНИЕМ КОЛОНОК ==========
document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('roadmapTable');
  const theadRow = table.querySelector('thead tr');
  const tbodyRows = Array.from(table.querySelectorAll('tbody tr'));
  const totalCols = theadRow.children.length; // должно быть 5

  // Функция скрыть/показать колонку по индексу
  function toggleColumn(colIndex, hide) {
    // Скрываем или показываем заголовок
    const th = theadRow.children[colIndex];
    if (!th) return;
    if (hide) {
      th.classList.add('hidden-col');
    } else {
      th.classList.remove('hidden-col');
    }

    // Проходим по всем строкам тела и скрываем нужную ячейку
    tbodyRows.forEach(row => {
      const td = row.children[colIndex];
      if (td) {
        if (hide) {
          td.classList.add('hidden-col');
        } else {
          td.classList.remove('hidden-col');
        }
      }
    });
  }

  // Состояние колонок (true = скрыта, false = видна)
  let colState = new Array(totalCols).fill(false);

  // Навешиваем обработчики на кнопки
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(btn => {
    const colIndex = parseInt(btn.getAttribute('data-col'), 10);
    btn.addEventListener('click', () => {
      const newState = !colState[colIndex];
      colState[colIndex] = newState;
      toggleColumn(colIndex, newState);
      // Небольшой визуальный фидбек: меняем стиль кнопки
      if (newState) {
        btn.style.opacity = '0.6';
        btn.style.textDecoration = 'line-through';
      } else {
        btn.style.opacity = '1';
        btn.style.textDecoration = 'none';
      }
    });
  });

  // Кнопка сброса (показать все колонки)
  const resetBtn = document.getElementById('resetColumnsBtn');
  resetBtn.addEventListener('click', () => {
    for (let i = 0; i < totalCols; i++) {
      if (colState[i]) {
        colState[i] = false;
        toggleColumn(i, false);
        const btn = document.querySelector(`.toggle-btn[data-col="${i}"]`);
        if (btn) {
          btn.style.opacity = '1';
          btn.style.textDecoration = 'none';
        }
      }
    }
  });
});

// ========== ПОИСК ПО ТАБЛИЦЕ (фильтр строк) ==========
const searchInput = document.getElementById('searchInput');
const table = document.getElementById('roadmapTable');
const tbody = table.querySelector('tbody');
const rows = Array.from(tbody.querySelectorAll('tr'));

function filterTable() {
  const query = searchInput.value.trim().toLowerCase();
  if (query === '') {
    rows.forEach(row => row.classList.remove('hidden-row'));
    return;
  }

  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    const rowText = cells.map(cell => cell.innerText.toLowerCase()).join(' ');
    const matches = rowText.includes(query);
    if (!matches) {
      row.classList.add('hidden-row');
    } else {
      row.classList.remove('hidden-row');
    }
  });
}

searchInput.addEventListener('input', filterTable);
searchInput.addEventListener('input', () => {
  const visibleRows = rows.filter(row => !row.classList.contains('hidden-row'));
  console.log(`🔎 Найдено строк: ${visibleRows.length} из ${rows.length}`);
});

filterTable();

// ========== КЛИК ПО ЯЧЕЙКЕ (лог в консоль) ==========
document.querySelectorAll('tbody td').forEach(cell => {
  cell.addEventListener('click', () => {
    const text = cell.innerText.trim().substring(0, 100);
    console.log(`[Неон] Клик: ${text}${cell.innerText.length > 100 ? '…' : ''}`);
  });
});

// ========== НЕОНОВАЯ ПОДСКАЗКА ПРИ ПЕРВОМ ВИЗИТЕ ==========
if (!localStorage.getItem('neonHintShown')) {
  setTimeout(() => {
    const hint = document.createElement('div');
    hint.textContent = '💡 Нажми на кнопку курса, чтобы скрыть/показать колонку. Поиск работает по всей таблице.';
    hint.style.position = 'fixed';
    hint.style.bottom = '20px';
    hint.style.right = '20px';
    hint.style.backgroundColor = '#ff2a9d';
    hint.style.color = '#0a0a0a';
    hint.style.padding = '8px 16px';
    hint.style.borderRadius = '40px';
    hint.style.fontSize = '0.8rem';
    hint.style.fontWeight = 'bold';
    hint.style.zIndex = '999';
    hint.style.boxShadow = '0 0 15px #ff2a9d';
    hint.style.cursor = 'pointer';
    hint.onclick = () => hint.remove();
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 6000);
    localStorage.setItem('neonHintShown', 'true');
  }, 1000);
}