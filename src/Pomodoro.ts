import * as vscode from 'vscode'
import { phrase } from './utils'
let counting: vscode.StatusBarItem

class Pomodoro {
  private focusTime: number
  private napTime: number
  private focusSeconds: number
  private napSeconds: number
  private _timer: NodeJS.Timeout
  private _isFocus: boolean

  constructor(focusTime: number = 25, napTime: number = 5) {
    this.focusTime = focusTime
    this.napTime = napTime
    this.focusSeconds = focusTime * 60
    this.napSeconds = napTime * 60
    this._timer = null
    this._isFocus = true
    console.log('focusTime', focusTime)
    console.log('napTime', napTime)
  }
  public start(tips: string = 'already start') {
    if (this.focusTime) {
      vscode.window.setStatusBarMessage(`The pomodora is ${tips}!`, 1500)

      const visible = vscode.workspace.getConfiguration().get('pomodoro.visible')
      if (visible && !counting) {
        counting = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
        counting.show()
      }

      this._timer = setInterval(() => {
        if (this._isFocus) {
          this.focusSeconds--
          counting.text = statusBarFormat(this.focusSeconds)
          if (this.focusSeconds === 0) {
            this._isFocus = !this._isFocus
            this.focusSeconds = this.focusTime * 60
            vscode.window.showInformationMessage(phrase[Math.floor(Math.random() * 5)])
          }
        } else {
          this.napSeconds--
          counting.text = statusBarFormat(this.napSeconds)
          if (this.napSeconds === 0) {
            this._isFocus = !this._isFocus
            this.napSeconds = this.napTime * 60
            vscode.window.showInformationMessage('Time to fucos!')
          }
        }
      }, 1000)
    } else {
      vscode.window.setStatusBarMessage('focus time is necessary!')
    }
  }
  public reset() {
    clearInterval(this._timer)
    this.focusSeconds = this.focusTime * 60
    this.napSeconds = this.napTime * 60
    this.start('reseting')
  }

  public destory(isDeactivate: boolean = false) {
    clearInterval(this._timer)
    counting?.dispose()
    if (!isDeactivate) {
      vscode.window.setStatusBarMessage('The pomodoro is already closed!', 1500)
    }
  }
}

function statusBarFormat(time: number) {
  const minute = Math.floor(time / 60)
  const second = time % 60
  return `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
}

export default Pomodoro
