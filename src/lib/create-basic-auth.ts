export function createBasicAuth(username: string, password: string): string {
  return 'Basic ' + window.btoa([username, password].join(':'))
}
