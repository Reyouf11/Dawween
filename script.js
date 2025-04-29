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
    addBtn.onclick = () => {
      const taskText = prompt("أدخل وصف المهمة:");
      const taskTime = prompt("وقت المهمة (مثلاً 14:00):");
      const priority = prompt("درجة الأهمية (عالي، متوسط، منخفض):");

      if (taskText && taskTime) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.textContent = `${taskTime} - ${taskText}`;

        const priorityIndicator = document.createElement('span');
        priorityIndicator.classList.add('priority');

        switch(priority) {
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

        task.prepend(priorityIndicator);
        taskContainer.appendChild(task);
      }
    };

    dayBox.appendChild(title);
    dayBox.appendChild(addBtn);
    dayBox.appendChild(taskContainer);
    calendarContainer.appendChild(dayBox);
  });
}
