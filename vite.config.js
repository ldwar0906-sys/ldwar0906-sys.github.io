import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // React 플러그인만 사용 (문제가 된 tailwindcss 부품은 제거함)
  plugins: [react()],
  
  // 깃허브 배포 시 하얀 화면이 나오지 않게 하는 핵심 설정입니다.
  // 저장소 이름인 'artdweb'을 정확히 기재해야 합니다.
  base: "/artdweb/", 
})