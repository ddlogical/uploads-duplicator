export default function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    
    if (timeoutMs) {
      setTimeout(() => abortController.abort(), timeoutMs);
    }
  
    return abortController.signal;
  }
