async function getAISuggestion(taskText) {
  const response = await fetch('http://localhost:3000/api/get-suggestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ taskText })
  });

  if (!response.ok) {
    throw new Error('فشل الاتصال بالخادم');
  }

  const data = await response.json();
  return data.suggestion;
}

const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const calendarContainer = document.getElementById('week-calendar');

if (calendarContainer) {
  days.forEach(day => {
    const dayBox = document.createElement('div');
    dayBox.classList.add('day');

    const title = document.createElement('h3');
    title.textContent = day;

    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

    const addBtn = document.createElement('button');
    addBtn.textContent = 'إضافة مهام';
    addBtn.onclick = async () => {
      const taskText = prompt("أدخل وصف المهمة:");
      const taskTime = prompt("وقت المهمة (مثلاً 14:00):");
      const priority = prompt("درجة الأهمية (عالي، متوسط، منخفض):");

      if (taskText && taskTime) {
        const task = document.createElement('div');
        task.classList.add('task');

        const priorityIndicator = document.createElement('span');
        priorityIndicator.classList.add('priority');

        switch (priority) {
          case 'عالي':
            priorityIndicator.style.backgroundColor = 'red';
            break;
          case 'متوسط':
            priorityIndicator.style.backgroundColor = 'orange';
            break;
          case 'منخفض':
            priorityIndicator.style.backgroundColor = 'green';
            break;
          default:
            priorityIndicator.style.backgroundColor = 'gray';
        }

        const taskInfo = document.createElement('span');
        taskInfo.textContent = `${taskTime} - ${taskText}`;
        taskInfo.style.marginRight = "8px";

        const aiButton = document.createElement('button');
        aiButton.textContent = '🔍 طلب خطة';
        aiButton.style.marginRight = '10px';

        const aiResult = document.createElement('div');
        aiResult.classList.add('ai-result');
        aiResult.style.marginTop = '5px';
        aiResult.style.fontSize = '0.9em';
        aiResult.style.color = '#555';

        aiButton.onclick = async () => {
          aiButton.disabled = true;
          aiButton.textContent = '...يُجهز الخطة';
          aiResult.textContent = 'جارٍ طلب الخطة...';

          try {
            const suggestion = await getAISuggestion(taskText);
            aiResult.textContent = suggestion;
          } catch (error) {
            aiResult.textContent = 'فشل الاتصال بالذكاء الاصطناعي.';
          }

          aiButton.textContent = '🔍 طلب خطة';
          aiButton.disabled = false;
        };

        task.appendChild(priorityIndicator);
        task.appendChild(taskInfo);
        task.appendChild(aiButton);
        task.appendChild(aiResult);

        taskContainer.appendChild(task);

        // بعد الإضافة، طبّق لون السمة على الأزرار الجديدة أيضاً
        applyThemeColorToButtons(task.querySelectorAll('button'));
      }
    };

    dayBox.appendChild(title);
    dayBox.appendChild(addBtn);
    dayBox.appendChild(taskContainer);
    calendarContainer.appendChild(dayBox);
  });
}

// دالة لتطبيق لون السمة على عناصر محددة (زر أو أزرار)
function applyThemeColorToButtons(buttons) {
  const themeColor = localStorage.getItem('themeColor');
  if (!themeColor) return;

  buttons.forEach(btn => {
    btn.style.backgroundColor = themeColor;

    // إزالة أي مستمع أحداث قديم لتفادي التكرار
    btn.onmouseenter = null;
    btn.onmouseleave = null;

    // hover effect
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = shadeColor(themeColor, -20);
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = themeColor;
    });
  });
}

// دالة لتطبيق لون السمة على الصفحة كلها عند التحميل
function applyThemeColorGlobally() {
  const themeColor = localStorage.getItem('themeColor');
  if (themeColor) {
    const header = document.querySelector('header');
    const buttons = document.querySelectorAll('button');

    if (header) header.style.backgroundColor = themeColor;

    applyThemeColorToButtons(buttons);

    // تحديث متغير CSS للون الرئيسي
    document.documentElement.style.setProperty('--main-color', themeColor);
  }
}

// دالة بسيطة لتغميق أو تفتيح اللون
function shadeColor(color, percent) {
  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// تشغيل الدالة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', applyThemeColorGlobally);
