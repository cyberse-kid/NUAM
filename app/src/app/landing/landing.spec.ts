import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing'; // nombre correcto del archivo y clase

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingComponent] // para componentes normales usamos declarations
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // necesario para inicializar la vista
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
