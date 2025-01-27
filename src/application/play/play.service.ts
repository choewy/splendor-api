import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayService {
  // TODO 토큰 가져가기
  async takeTokens() {
    // TODO 잔여 토큰 수량 파악
    // TODO 가져갈 토큰 수량 및 종류 파악(같은 종류인 경우 2개만 획득 가능)
    // TODO 플레이어의 토큰 수량 증가

    return;
  }

  // TODO 개발 카드 찜하기
  async dibCard() {
    // TODO 플레이어의 찜 개수 파악(최대 3개)
    // TODO 카드를 플레이어의 찜 목록에 추가
    // TODO 노란색 토큰 개수 확인 후 획득
    // TODO 덱에서 새로운 카드 뽑아서 필드에 추가

    return;
  }

  // TODO 카드 구매하기
  async purchaseCard() {
    // TODO 플레이어의 보너스 및 토큰 수량 파악(플레이어가 소지한 노란색 토큰 수량 고려)
    // TODO 플레이어의 토근 수량 차감
    // TODO 플레이어의 보너스 증가
    // TODO 플레이어의 점수 증가
    // TODO 덱에서 새로운 카드 뽑아서 필드에 추가

    return;
  }
}
