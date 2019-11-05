import { IRootService } from '../services/root-sevice.interface';
import { UserService } from '../services/user.service';

// TODO: Here you can add root services
export const services: Array<(new () => IRootService) | (new () => object)> = [UserService];
