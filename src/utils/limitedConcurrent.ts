type Task<R> = () => Promise<R>

interface Options {
  maxPenddingTasks?: number
}

const defaultOption = {
  maxPenddingTasks: 5,
}

function limitedConcurrent <R> (tasks: Task<R>[], options?: Options) {
  const { maxPenddingTasks } = { ...defaultOption, ...options }
  const penddingTasks: Set<Task<R>> = new Set()
  const taskResults: R[] = []

  let taskIndex = 0

  return new Promise<R[]>((resolve, reject) => {

    function pickAndPerformTask () {
      if (penddingTasks.size >= maxPenddingTasks) return
      if (tasks.length === 0) {
        if (penddingTasks.size === 0) return resolve(taskResults)
        else return
      }

      const task = tasks.shift() as Task<R>
      performTask(task, taskIndex)
      taskIndex += 1
      pickAndPerformTask()
    }

    function performTask (task: Task<R>, index: number) {
      if (penddingTasks.size >= maxPenddingTasks) return

      penddingTasks.add(task)
      const taskPromise = task()
      taskPromise.then(result => {
        taskResults[index] = result
        penddingTasks.delete(task)
        pickAndPerformTask()
      }).catch(reject)
    }

    pickAndPerformTask()

  })
}

export default limitedConcurrent
