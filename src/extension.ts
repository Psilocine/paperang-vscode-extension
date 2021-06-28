// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import Pomodoro from './Pomodoro'
let pomodoro: Pomodoro = null

export function activate(context: vscode.ExtensionContext) {
  const focusTime = vscode.workspace.getConfiguration().get('pomodoro.focus') as number
  const napTime = vscode.workspace.getConfiguration().get('pomodoro.nap') as number
  pomodoro = new Pomodoro(focusTime, napTime)

  const startPomodoroDisposable = vscode.commands.registerCommand('extension.startPomodoro', () => {
    pomodoro.start()
  })

  const resetPomodoroDisposable = vscode.commands.registerCommand('extension.resetPomodoro', () => {
    pomodoro.reset()
  })

  const closePomodoroDisposable = vscode.commands.registerCommand('extension.closePomodoro', () => {
    pomodoro.destory()
  })

  context.subscriptions.push(
    startPomodoroDisposable,
    resetPomodoroDisposable,
    closePomodoroDisposable
  )
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (pomodoro) {
    pomodoro.destory(true)
  }
}
